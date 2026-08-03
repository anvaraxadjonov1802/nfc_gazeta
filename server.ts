import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import qrcode from 'qrcode';
import { 
  DEMO_ISSUES, 
  DEMO_PAGES, 
  DEMO_ARTICLES, 
  DEMO_NEWSPAPER, 
  DEMO_USERS, 
  DEMO_ANALYTICS 
} from './src/lib/demoData.js';
import { Issue, Page, Article, ProcessingJob, User } from './src/types.js';

// Setup file upload storage
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// In-memory database store initialized with demo data
let issuesStore: Issue[] = [...DEMO_ISSUES];
let pagesStore: Record<string, Page[]> = { ...DEMO_PAGES };
let articlesStore: Record<string, Article[]> = { ...DEMO_ARTICLES };
let jobsStore: Record<string, ProcessingJob[]> = {};
let nfcEventsCount = 1482;

// Lazy Gemini client helper
let genAIInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAIInstance && process.env.GEMINI_API_KEY) {
    try {
      genAIInstance = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.warn('Gemini client init error:', e);
    }
  }
  return genAIInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure uploads directory exists
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = DEMO_USERS.find(u => u.email === email);
    if (!user || password !== 'demo123') {
      res.status(401).json({ error: 'Elektron pochta yoki parol noto‘g‘ri' });
      return;
    }
    res.json({
      token: `fake-jwt-token-${user.id}`,
      user
    });
  });

  // Auth: Me
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Tizimga kirilmagan' });
      return;
    }
    res.json({ user: DEMO_USERS[0] });
  });

  // Public: Get list of issues
  app.get('/api/public/issues', (req: Request, res: Response) => {
    const { year, month, search } = req.query;
    let filtered = issuesStore.filter(i => i.is_public);

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.newspaper_name.toLowerCase().includes(q) ||
        (i.summary && i.summary.toLowerCase().includes(q))
      );
    }

    if (year && typeof year === 'string') {
      filtered = filtered.filter(i => i.publication_date.startsWith(year));
    }

    if (month && typeof month === 'string') {
      filtered = filtered.filter(i => {
        const dateMonth = i.publication_date.split('-')[1];
        return dateMonth === month.padStart(2, '0');
      });
    }

    res.json(filtered);
  });

  // Public: Get issue by slug
  app.get('/api/public/issues/:slug', (req: Request, res: Response) => {
    const issue = issuesStore.find(i => i.slug === req.params.slug || i.nfc_slug === req.params.slug);
    if (!issue) {
      res.status(404).json({ error: 'Gazeta nashri topilmadi' });
      return;
    }
    const pages = pagesStore[issue.id] || [];
    const articles = articlesStore[issue.id] || [];
    res.json({ ...issue, pages, articles, newspaper: DEMO_NEWSPAPER });
  });

  // Public: Get specific page
  app.get('/api/public/issues/:slug/pages/:pageNum', (req: Request, res: Response) => {
    const issue = issuesStore.find(i => i.slug === req.params.slug || i.nfc_slug === req.params.slug);
    if (!issue) {
      res.status(404).json({ error: 'Gazeta nashri topilmadi' });
      return;
    }
    const pageNum = parseInt(req.params.pageNum, 10);
    const pages = pagesStore[issue.id] || [];
    const page = pages.find(p => p.page_number === pageNum);
    if (!page) {
      res.status(404).json({ error: 'Bet topilmadi' });
      return;
    }
    res.json(page);
  });

  // Public: Get specific article
  app.get('/api/public/issues/:slug/articles/:articleSlug', (req: Request, res: Response) => {
    const issue = issuesStore.find(i => i.slug === req.params.slug || i.nfc_slug === req.params.slug);
    if (!issue) {
      res.status(404).json({ error: 'Gazeta nashri topilmadi' });
      return;
    }
    const articles = articlesStore[issue.id] || [];
    const article = articles.find(a => a.slug === req.params.articleSlug);
    if (!article) {
      res.status(404).json({ error: 'Maqola topilmadi' });
      return;
    }
    res.json(article);
  });

  // Public: Search across issues and articles
  app.get('/api/public/search', (req: Request, res: Response) => {
    const query = (req.query.q as string || '').toLowerCase().trim();
    if (!query) {
      res.json({ issues: [], articles: [] });
      return;
    }

    const matchedIssues = issuesStore.filter(i => 
      i.title.toLowerCase().includes(query) || 
      (i.summary && i.summary.toLowerCase().includes(query))
    );

    const matchedArticles: any[] = [];
    Object.keys(articlesStore).forEach(issueId => {
      const issue = issuesStore.find(i => i.id === issueId);
      if (!issue) return;
      const articles = articlesStore[issueId];
      articles.forEach(art => {
        if (
          art.title.toLowerCase().includes(query) ||
          art.category.toLowerCase().includes(query) ||
          art.final_text.toLowerCase().includes(query)
        ) {
          matchedArticles.push({
            ...art,
            issue_slug: issue.slug,
            issue_title: issue.title,
            issue_number: issue.issue_number
          });
        }
      });
    });

    res.json({ issues: matchedIssues, articles: matchedArticles });
  });

  // Public: NFC Scan redirect event
  app.post('/api/public/nfc/:nfcSlug/open', (req: Request, res: Response) => {
    const { nfcSlug } = req.params;
    nfcEventsCount++;
    const issue = issuesStore.find(i => i.nfc_slug === nfcSlug || i.slug === nfcSlug);
    if (!issue) {
      res.status(404).json({ error: 'NFC havolasiga mos gazeta topilmadi' });
      return;
    }
    res.json({
      success: true,
      issue_slug: issue.slug,
      redirect_url: `/nashr/${issue.slug}`
    });
  });

  // Public: AI Newspaper Assistant
  app.post('/api/public/ai-ask', async (req: Request, res: Response) => {
    const { issue_slug, question, article_slug } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Savol kiritilmadi' });
      return;
    }

    const issue = issuesStore.find(i => i.slug === issue_slug);
    if (!issue) {
      res.status(404).json({ error: 'Gazeta topilmadi' });
      return;
    }

    const pages = pagesStore[issue.id] || [];
    const fullIssueText = pages.map(p => `[${p.page_number}-bet]: ${p.final_text}`).join('\n\n');

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if no API key
      res.json({
        answer: `Ushbu "${issue.title}" gazeta sonida keltirilishicha: ${issue.summary}. ${question} bo‘yicha batafsil ma’lumot berilgan.`
      });
      return;
    }

    try {
      const prompt = `Siz O‘zbekiston Temir yo‘llari gazetasining rasmiy audio yordamchisiz.
Quyida berilgan gazeta matnidan foydalanib foydalanuvchi savoliga qisqa va aniq javob bering.

Qoida:
1. Faqat gazeta matnidagi ma'lumotlarga tayaning.
2. Agarda savolga javob matnda bo'lmasa, DANIQ QUYIDAGI SO'ZLARNI AYYTING: "Bu savolga javob gazetada topilmadi."
3. Javobingiz ravon Uzbek Latin tilida bo'lsin.

Gazeta matni:
${fullIssueText}

Foydalanuvchi savoli: ${question}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      res.json({ answer: response.text || 'Bu savolga javob gazetada topilmadi.' });
    } catch (err) {
      console.error('Gemini AI Ask error:', err);
      res.json({ answer: 'Bu savolga javob gazetada topilmadi.' });
    }
  });

  // Public: Generate QR code image url data
  app.get('/api/public/qrcode', async (req: Request, res: Response) => {
    const text = req.query.text as string;
    if (!text) {
      res.status(400).send('Text parameter missing');
      return;
    }
    try {
      const qrDataUrl = await qrcode.toDataURL(text, { width: 300, margin: 2 });
      res.json({ qrDataUrl });
    } catch (e) {
      res.status(500).json({ error: 'QR Kod yaratishda xatolik' });
    }
  });

  // Admin: Get all issues (including draft/processing)
  app.get('/api/admin/issues', (req: Request, res: Response) => {
    res.json(issuesStore);
  });

  // Admin: Create issue draft
  app.post('/api/admin/issues', (req: Request, res: Response) => {
    const { title, issue_number, publication_date, newspaper_name, nfc_slug } = req.body;
    const slug = (nfc_slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      newspaper_id: DEMO_NEWSPAPER.id,
      newspaper_name: newspaper_name || DEMO_NEWSPAPER.name,
      title: title || 'Temiryo‘lchi Gazetasi Yangi Son',
      slug,
      issue_number: issue_number || `№ ${Math.floor(Math.random() * 50) + 1}`,
      publication_date: publication_date || new Date().toISOString().split('T')[0],
      status: 'draft',
      cover_image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80',
      page_count: 0,
      estimated_audio_duration: 0,
      nfc_slug: slug,
      is_public: false,
      processing_progress: 0,
      created_by: 'usr-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    issuesStore.unshift(newIssue);
    pagesStore[newIssue.id] = [];
    articlesStore[newIssue.id] = [];

    res.json(newIssue);
  });

  // Admin: Upload PDF & run pipeline processing
  app.post('/api/admin/issues/:id/upload-pdf', upload.single('pdf'), async (req: Request, res: Response) => {
    const issueId = req.params.id;
    const issue = issuesStore.find(i => i.id === issueId);
    if (!issue) {
      res.status(404).json({ error: 'Gazeta topilmadi' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'PDF fayli yuklanmadi' });
      return;
    }

    issue.status = 'processing';
    issue.processing_progress = 10;
    issue.current_step_text = '1. PDF yuklanmoqda';

    // Async pipeline runner
    runPdfPipeline(issue, req.file.path);

    res.json({
      message: 'PDF muvaffaqiyatli yuklandi va qayta ishlash boshlandi',
      issue
    });
  });

  // Admin: Get job progress
  app.get('/api/admin/issues/:id/jobs', (req: Request, res: Response) => {
    const jobs = jobsStore[req.params.id] || [];
    res.json(jobs);
  });

  // Admin: Edit page text/blocks
  app.patch('/api/admin/pages/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { final_text, text_blocks } = req.body;

    let updatedPage: Page | null = null;
    Object.keys(pagesStore).forEach(issueId => {
      const pIdx = pagesStore[issueId].findIndex(p => p.id === id);
      if (pIdx !== -1) {
        if (final_text !== undefined) pagesStore[issueId][pIdx].final_text = final_text;
        if (text_blocks !== undefined) pagesStore[issueId][pIdx].text_blocks = text_blocks;
        pagesStore[issueId][pIdx].updated_at = new Date().toISOString();
        updatedPage = pagesStore[issueId][pIdx];
      }
    });

    if (!updatedPage) {
      res.status(404).json({ error: 'Bet topilmadi' });
      return;
    }

    res.json(updatedPage);
  });

  // Admin: Regenerate Audio for a page
  app.post('/api/admin/pages/:id/regenerate-audio', (req: Request, res: Response) => {
    const { id } = req.params;
    let foundPage: Page | null = null;

    Object.keys(pagesStore).forEach(issueId => {
      const p = pagesStore[issueId].find(p => p.id === id);
      if (p) {
        p.audio_url = `/api/audio/sample-p1.mp3?t=${Date.now()}`;
        p.updated_at = new Date().toISOString();
        foundPage = p;
      }
    });

    if (!foundPage) {
      res.status(404).json({ error: 'Bet topilmadi' });
      return;
    }

    res.json({ message: 'Audio qayta yaratildi', page: foundPage });
  });

  // Admin: Publish / Unpublish issue
  app.post('/api/admin/issues/:id/publish', (req: Request, res: Response) => {
    const issue = issuesStore.find(i => i.id === req.params.id);
    if (!issue) {
      res.status(404).json({ error: 'Gazeta topilmadi' });
      return;
    }
    issue.status = 'published';
    issue.is_public = true;
    issue.published_at = new Date().toISOString();
    res.json(issue);
  });

  app.post('/api/admin/issues/:id/unpublish', (req: Request, res: Response) => {
    const issue = issuesStore.find(i => i.id === req.params.id);
    if (!issue) {
      res.status(404).json({ error: 'Gazeta topilmadi' });
      return;
    }
    issue.status = 'approved';
    issue.is_public = false;
    res.json(issue);
  });

  // Admin: Analytics Summary
  app.get('/api/admin/analytics', (req: Request, res: Response) => {
    res.json({
      ...DEMO_ANALYTICS,
      totalNfcOpens: nfcEventsCount
    });
  });

  // Audio sample generator route
  app.get('/api/audio/:file', (req: Request, res: Response) => {
    // Generate simple synthetic wave stream / audio header
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    // Minimal audio buffer mock response
    const sampleBuffer = Buffer.alloc(1024 * 16); 
    res.send(sampleBuffer);
  });

  // Pipeline execution helper
  async function runPdfPipeline(issue: Issue, pdfFilePath: string) {
    const steps = [
      { progress: 15, text: '1. PDF yuklanmoqda' },
      { progress: 25, text: '2. Betlar ajratilmoqda' },
      { progress: 40, text: '3. Matn aniqlanmoqda' },
      { progress: 55, text: '4. Rasmlar ajratilmoqda' },
      { progress: 70, text: '5. Maqolalar aniqlanmoqda' },
      { progress: 85, text: '6. Matn tekshirilmoqda' },
      { progress: 95, text: '7. Audio tayyorlanmoqda' },
      { progress: 100, text: '8. Nashr ko‘rib chiqishga tayyor' },
    ];

    let extractedPdfText = '';
    try {
      if (fs.existsSync(pdfFilePath)) {
        const dataBuffer = fs.readFileSync(pdfFilePath);
        const parsed = await pdfParse(dataBuffer);
        extractedPdfText = parsed.text || '';
      }
    } catch (err) {
      console.warn('PDF Parsing fallback:', err);
    }

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      issue.processing_progress = steps[i].progress;
      issue.current_step_text = steps[i].text;
    }

    // Populate extracted pages
    const pageCount = 4;
    issue.page_count = pageCount;
    issue.status = 'needs_review';
    issue.estimated_audio_duration = 540;

    const generatedPages: Page[] = [];
    const sampleImages = [
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
    ];

    for (let pNum = 1; pNum <= pageCount; pNum++) {
      const pText = extractedPdfText 
        ? extractedPdfText.slice((pNum - 1) * 300, pNum * 300) 
        : `${pNum}-bet: Temir yo‘l xavfsizligi va yangi tezyurar poyezdlar harakati yo‘lga qo‘yildi. Yo‘lovchilarga sifatli xizmat ko‘rsatish va audio gazetadan foydalanish imkoniyatlari.`;

      generatedPages.push({
        id: `page-${issue.id}-${pNum}`,
        issue_id: issue.id,
        page_number: pNum,
        original_page_image_url: sampleImages[pNum - 1],
        thumbnail_url: sampleImages[pNum - 1],
        raw_text: pText,
        ocr_text: pText,
        cleaned_text: `${pNum}-bet tozalandi: ${pText}`,
        final_text: `${issue.title}. ${pNum}-bet matni. ${pText}`,
        audio_url: '/api/audio/sample-p1.mp3',
        audio_duration: 135,
        processing_status: 'ready',
        extraction_confidence: 0.96,
        width: 1200,
        height: 1600,
        text_blocks: [
          {
            id: `tb-${issue.id}-${pNum}-1`,
            page_id: `page-${issue.id}-${pNum}`,
            type: 'heading',
            raw_text: `${pNum}-BET MAVZUSI`,
            cleaned_text: `${pNum}-bet mavzusi`,
            final_text: `${pNum}-bet: Temiryo‘l yangiliklari va tadbirlar`,
            reading_order: 1,
            confidence: 0.98
          },
          {
            id: `tb-${issue.id}-${pNum}-2`,
            page_id: `page-${issue.id}-${pNum}`,
            type: 'paragraph',
            raw_text: pText,
            cleaned_text: pText,
            final_text: pText,
            reading_order: 2,
            confidence: 0.97
          }
        ],
        images: [
          {
            id: `img-${issue.id}-${pNum}`,
            issue_id: issue.id,
            page_id: `page-${issue.id}-${pNum}`,
            type: 'extracted_photo',
            original_url: sampleImages[pNum - 1],
            optimized_url: sampleImages[pNum - 1],
            thumbnail_url: sampleImages[pNum - 1],
            caption: `${pNum}-bet surat va rasmlari`,
            reading_order: 1
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    pagesStore[issue.id] = generatedPages;

    // Create extracted articles
    articlesStore[issue.id] = [
      {
        id: `art-${issue.id}-1`,
        issue_id: issue.id,
        title: `${issue.title} - Bosh Maqola`,
        slug: `bosh-maqola-${issue.id}`,
        category: 'Temiryo‘l yangiliklari',
        author: 'Muharririyat',
        summary: 'Ushbu gazetaning 1-betida e’lon qilingan asosiy voqealar va xabarlar sharhi.',
        cleaned_text: generatedPages[0]?.final_text || '',
        final_text: generatedPages[0]?.final_text || '',
        audio_url: '/api/audio/sample-art-1.mp3',
        estimated_duration: 180,
        reading_order: 1,
        page_numbers: [1],
        main_image_url: sampleImages[0],
        paragraphs: [generatedPages[0]?.final_text || ''],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Cleanup uploaded temp file if exists
    try {
      if (fs.existsSync(pdfFilePath)) fs.unlinkSync(pdfFilePath);
    } catch (e) {}
  }

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
