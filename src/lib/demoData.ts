import { Issue, Page, Article, Newspaper, AnalyticsSummary, User } from '../types';

export const DEMO_NEWSPAPER: Newspaper = {
  id: 'np-1',
  name: 'Temiryo‘lchi',
  slug: 'temiryolchi',
  description: 'O‘zbekiston temir yo‘llari aksiyadorlik jamiyatining rasmiy axborot va ma’rifiy gazetasi',
  logo_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
  language: 'uz_Latn',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
};

export const DEMO_USERS: User[] = [
  {
    id: 'usr-1',
    email: 'admin@temiryol.uz',
    full_name: 'Alisher Qodirov',
    role: 'super_admin',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'usr-2',
    email: 'muarrir@temiryol.uz',
    full_name: 'Nigora Yo‘ldosheva',
    role: 'editor',
    is_active: true,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  }
];

export const DEMO_ISSUES: Issue[] = [
  {
    id: 'issue-2026-08-01',
    newspaper_id: 'np-1',
    newspaper_name: 'Temiryo‘lchi',
    title: 'Temiryo‘lchi Gazetasi - Maxsus Avgust Soni',
    slug: 'temiryolchi-2026-08-01',
    issue_number: '№ 31 (4890)',
    publication_date: '2026-08-01',
    status: 'published',
    cover_image_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
    original_pdf_url: '/assets/pdf/temiryolchi-2026-08-01.pdf',
    page_count: 5,
    estimated_audio_duration: 720, // 12 mins
    nfc_slug: 'temiryolchi-2026-08-01',
    is_public: true,
    processing_progress: 100,
    current_step_text: 'Nashr ko‘rib chiqishga tayyor',
    created_by: 'usr-1',
    published_at: '2026-08-01T08:00:00Z',
    created_at: '2026-07-31T12:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
    summary: 'Ushbu sonda: Yangi tezyurar elektropoyezd qatnovlari yo‘lga qo‘yildi, Toshkent vokzalida xavfsizlik va qulaylik texnologiyalari takomillashtirildi, temiryo‘lchilar kasb bayramiga tayyorgarlik jarayonlari.'
  },
  {
    id: 'issue-2026-07-15',
    newspaper_id: 'np-1',
    newspaper_name: 'O‘zbekiston Temir Yo‘llari Xabarlari',
    title: 'O‘zbekiston Temir Yo‘llari Xabarlari - Iyul Soni',
    slug: 'temir-yollari-2026-07-15',
    issue_number: '№ 28 (4887)',
    publication_date: '2026-07-15',
    status: 'published',
    cover_image_url: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=800&auto=format&fit=crop&q=80',
    original_pdf_url: '/assets/pdf/temiryolchi-2026-07-15.pdf',
    page_count: 5,
    estimated_audio_duration: 680,
    nfc_slug: 'temir-yollari-2026-07-15',
    is_public: true,
    processing_progress: 100,
    created_by: 'usr-2',
    published_at: '2026-07-15T08:00:00Z',
    created_at: '2026-07-14T10:00:00Z',
    updated_at: '2026-07-15T08:00:00Z',
    summary: 'Ushbu sonda: Yozgi mavsumda yo‘lovchi tashish hajmi oshdi, zamonaviy vagonlar ta’miri va texnik ko‘rik sifati oshirildi.'
  },
  {
    id: 'issue-2026-06-30',
    newspaper_id: 'np-1',
    newspaper_name: 'Lokomotiv Va Yo‘lovchi',
    title: 'Lokomotiv Va Yo‘lovchi Gazetasi - Iyun Soni',
    slug: 'lokomotiv-2026-06-30',
    issue_number: '№ 24 (4883)',
    publication_date: '2026-06-30',
    status: 'published',
    cover_image_url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&auto=format&fit=crop&q=80',
    original_pdf_url: '/assets/pdf/lokomotiv-2026-06-30.pdf',
    page_count: 5,
    estimated_audio_duration: 610,
    nfc_slug: 'lokomotiv-2026-06-30',
    is_public: true,
    processing_progress: 100,
    created_by: 'usr-1',
    published_at: '2026-06-30T08:00:00Z',
    created_at: '2026-06-29T14:00:00Z',
    updated_at: '2026-06-30T08:00:00Z',
    summary: 'Ushbu sonda: Lokomotiv brigadalari uchun yangi tibbiy xizmatlar, temir yo‘l xavfsizligi bo‘yicha yangi yo‘riqnomalar.'
  }
];

export const DEMO_PAGES: Record<string, Page[]> = {
  'issue-2026-08-01': [
    {
      id: 'p1-issue-1',
      issue_id: 'issue-2026-08-01',
      page_number: 1,
      original_page_image_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1000&auto=format&fit=crop&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300&auto=format&fit=crop&q=80',
      raw_text: 'TEMIRYO‘LCHI GAZETASI. BOSH MAVZU: YANGI QATNOVLAR VA RAQAMLI QULAYLIKLAR. Respublika temir yo‘llarida yangi zamonaviy poyezdlar harakati yo‘lga qo‘yildi.',
      ocr_text: 'TEMIRYOLCHI GAZETASI. BOSH MAVZU: YANGI QATNOVLAR VA RAQAMLI QULAYLIKLAR.',
      cleaned_text: 'Temiryo‘lchi gazetasi, 1-avgust 2026-yil. Bosh sahifa. Yangi tezyurar elektropoyezd qatnovlari yo‘lga qo‘yildi.',
      final_text: 'Temiryo‘lchi gazetasi. 1-avgust 2026-yil. Bosh sahifa: Respublika temir yo‘llarida yangi zamonaviy poyezdlar harakati yo‘lga qo‘yildi. Yo‘lovchilar uchun barcha sharoitlar yaratilmoqda. Vokzallarda NFC va ovozli ma’lumot beruvchi raqamli tizimlar o‘rnatildi.',
      audio_url: '/api/audio/sample-p1.mp3',
      audio_duration: 145,
      processing_status: 'ready',
      extraction_confidence: 0.98,
      width: 1200,
      height: 1600,
      text_blocks: [
        {
          id: 'tb-1',
          page_id: 'p1-issue-1',
          type: 'heading',
          raw_text: 'TEMIRYO‘LCHI GAZETASI',
          cleaned_text: 'Temiryo‘lchi gazetasi',
          final_text: 'Temiryo‘lchi gazetasi - Rasmiy nashr',
          reading_order: 1,
          confidence: 0.99
        },
        {
          id: 'tb-2',
          page_id: 'p1-issue-1',
          type: 'subheading',
          raw_text: 'BOSH MAVZU: YANGI TEZYURAR POYEZDLAR',
          cleaned_text: 'Bosh mavzu: Yangi tezyurar poyezdlar',
          final_text: 'Bosh mavzu: Respublika bo‘ylab yangi tezyurar elektropoyezdlar harakati yo‘lga qo‘yildi',
          reading_order: 2,
          confidence: 0.97
        },
        {
          id: 'tb-3',
          page_id: 'p1-issue-1',
          type: 'paragraph',
          raw_text: 'Bugun Toshkent Markaziy vokzalidan yangi yo‘nalish bo‘yicha tezyurar poyezd birinchi qatnovini amalga oshirdi. Poyezd tarkibida barcha zamonaviy qulayliklar mavjud.',
          cleaned_text: 'Bugun Toshkent Markaziy vokzalidan yangi yo‘nalish bo‘yicha tezyurar poyezd birinchi qatnovini amalga oshirdi. Poyezd tarkibida barcha zamonaviy qulayliklar mavjud.',
          final_text: 'Bugun Toshkent Markaziy vokzalidan yangi yo‘nalish bo‘yicha tezyurar poyezd birinchi qatnovini amalga oshirdi. Poyezd tarkibida barcha zamonaviy qulayliklar, shuningdek imkoniyati cheklangan yo‘lovchilar uchun maxsus moslamalar mavjud.',
          reading_order: 3,
          confidence: 0.98
        },
        {
          id: 'tb-4',
          page_id: 'p1-issue-1',
          type: 'paragraph',
          raw_text: 'Vokzal binolarida ko‘zi ojiz va ko‘rishda qiyinchiligi bor yo‘lovchilar uchun NFC chipli audio ko‘rsatkichlar o‘rnatildi. Ushbu texnologiya har bir poyezd jadvalini ovozli tarzda eshitish imkonini beradi.',
          cleaned_text: 'Vokzal binolarida ko‘zi ojiz va ko‘rishda qiyinchiligi bor yo‘lovchilar uchun NFC chipli audio ko‘rsatkichlar o‘rnatildi.',
          final_text: 'Vokzal binolarida ko‘zi ojiz va ko‘rishda qiyinchiligi bor yo‘lovchilar uchun NFC chipli audio ko‘rsatkichlar va yo‘naltiruvchi maxsus taktil yo‘laklar yotqizildi.',
          reading_order: 4,
          confidence: 0.96
        }
      ],
      images: [
        {
          id: 'img-1',
          issue_id: 'issue-2026-08-01',
          page_id: 'p1-issue-1',
          type: 'extracted_photo',
          original_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
          optimized_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300&auto=format&fit=crop&q=80',
          caption: 'Toshkent Markaziy vokzalidagi yangi zamonaviy poyezd',
          alt_text: 'Vokzal perronida to‘xtab turgan zamonaviy oq va ko‘k rangli poyezd',
          reading_order: 1
        }
      ],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    },
    {
      id: 'p2-issue-1',
      issue_id: 'issue-2026-08-01',
      page_number: 2,
      original_page_image_url: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=1000&auto=format&fit=crop&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=300&auto=format&fit=crop&q=80',
      raw_text: '2-BET: YO‘LOVCHILAR UCHUN XAVFSIZLIK VA XIZMAT KO‘RSATISH SIFATI. Poyezdlarda va vokzallarda xavfsizlik qoidalariga rioya etish muhim.',
      ocr_text: '2-BET: YO‘LOVCHILAR UCHUN XAVFSIZLIK VA XIZMAT KO‘RSATISH SIFATI.',
      cleaned_text: '2-bet: Yo‘lovchilar uchun xavfsizlik va xizmat ko‘rsatish sifati.',
      final_text: '2-bet: Yo‘lovchilar uchun xavfsizlik hamda xizmat ko‘rsatish sifatini oshirish choralari. Temir yo‘l poyezdlarida xavfsizlik qoidalari to‘g‘risida muhim eslatmalar va tavsiyalar.',
      audio_url: '/api/audio/sample-p2.mp3',
      audio_duration: 130,
      processing_status: 'ready',
      extraction_confidence: 0.96,
      width: 1200,
      height: 1600,
      text_blocks: [
        {
          id: 'tb-21',
          page_id: 'p2-issue-1',
          type: 'heading',
          raw_text: 'YO‘LOVCHILAR UCHUN XAVFSIZLIK QAIDALARI',
          cleaned_text: 'Yo‘lovchilar uchun xavfsizlik qoidalari',
          final_text: 'Yo‘lovchilar uchun xavfsizlik va harakat xavfsizligi qoidalari',
          reading_order: 1,
          confidence: 0.98
        },
        {
          id: 'tb-22',
          page_id: 'p2-issue-1',
          type: 'paragraph',
          raw_text: 'Poyezd harakatlanayotgan vaqtda vagondan chiqishga yoki kirishga urinmang. Barcha vokzal hududida maxsus signallarga va xodimlarning ko‘rsatmalariga amal qiling.',
          cleaned_text: 'Poyezd harakatlanayotgan vaqtda vagondan chiqishga yoki kirishga urinmang.',
          final_text: 'Poyezd harakatlanayotgan vaqtda vagondan chiqishga yoki kirishga urinmang. Barcha vokzal hududida maxsus audio va ko‘rgazmali signallarga e’tibor bering.',
          reading_order: 2,
          confidence: 0.97
        }
      ],
      images: [
        {
          id: 'img-2',
          issue_id: 'issue-2026-08-01',
          page_id: 'p2-issue-1',
          type: 'extracted_photo',
          original_url: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=800&auto=format&fit=crop&q=80',
          optimized_url: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=300&auto=format&fit=crop&q=80',
          caption: 'Vokzal hududidagi audio ogohlantirish moslamasi',
          alt_text: 'Vokzaldagi elektron ma’lumotlar tablos va radiokarnay',
          reading_order: 1
        }
      ],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    },
    {
      id: 'p3-issue-1',
      issue_id: 'issue-2026-08-01',
      page_number: 3,
      original_page_image_url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1000&auto=format&fit=crop&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=300&auto=format&fit=crop&q=80',
      raw_text: '3-BET: TEMIRYO‘LCHILAR KASB BAYRAMI VA FAXRIYLAR. Fidoiy temiryo‘lchilarimizga yuksak mukofotlar topshirildi.',
      ocr_text: '3-BET: TEMIRYO‘LCHILAR KASB BAYRAMI VA FAXRIYLAR.',
      cleaned_text: '3-bet: Temiryo‘lchilar kasb bayrami va faxriylar.',
      final_text: '3-bet: Temiryo‘lchilar kasb bayramiga bag‘ishlangan tantanali marosimlar. Mehnat faxriylari va soha xodimlariga davlat mukofotlari va esdalik nishonlari topshirildi.',
      audio_url: '/api/audio/sample-p3.mp3',
      audio_duration: 150,
      processing_status: 'ready',
      extraction_confidence: 0.97,
      width: 1200,
      height: 1600,
      text_blocks: [
        {
          id: 'tb-31',
          page_id: 'p3-issue-1',
          type: 'heading',
          raw_text: 'SOHA FAXRIYLARIGA E’TIBOR VA E’TIROF',
          cleaned_text: 'Soha faxriylariga e’tibor va e’tirof',
          final_text: 'Soha faxriylariga yuksak e’tibor va e’tirof marosimi',
          reading_order: 1,
          confidence: 0.99
        },
        {
          id: 'tb-32',
          page_id: 'p3-issue-1',
          type: 'paragraph',
          raw_text: 'Temir yo‘l sohasida ko‘p yillar davomida halol va fidoiyan mehnat qilgan faxriylarimizga soha rahbariyati tomonidan faxriy yorliqlar hamda qimmatbaho sovg‘alar topshirildi.',
          cleaned_text: 'Temir yo‘l sohasida ko‘p yillar davomida halol va fidoiyan mehnat qilgan faxriylarimizga sovg‘alar topshirildi.',
          final_text: 'Temir yo‘l sohasida ko‘p yillar davomida halol va fidoiyan mehnat qilgan faxriylarimizga soha rahbariyati tomonidan faxriy yorliqlar hamda moddiy rag‘batlantirish sovg‘alari topshirildi.',
          reading_order: 2,
          confidence: 0.98
        }
      ],
      images: [
        {
          id: 'img-3',
          issue_id: 'issue-2026-08-01',
          page_id: 'p3-issue-1',
          type: 'extracted_photo',
          original_url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&auto=format&fit=crop&q=80',
          optimized_url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=300&auto=format&fit=crop&q=80',
          caption: 'Bayram marosimidan esdalik fotosurati',
          alt_text: 'Zalda bayram munosabati bilan yig‘ilgan temiryo‘l xodimlari',
          reading_order: 1
        }
      ],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    },
    {
      id: 'p4-issue-1',
      issue_id: 'issue-2026-08-01',
      page_number: 4,
      original_page_image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
      raw_text: '4-BET: YILNING ENG YAXSHI SHOGIRDI VA USTOZ TIZIMI. Temir yo‘l kollejlari va muhandislik institutlari bitiruvchilari.',
      ocr_text: '4-BET: YILNING ENG YAXSHI SHOGIRDI VA USTOZ TIZIMI.',
      cleaned_text: '4-bet: Yilning eng yaxshi shogirdi va ustoz-shogird an’analari.',
      final_text: '4-bet: Ustoz-shogird tizimini rivojlantirish hamda yosh mutassislar faoliyatini qo‘llab-quvvatlash chora-tadbirlari.',
      audio_url: '/api/audio/sample-p4.mp3',
      audio_duration: 140,
      processing_status: 'ready',
      extraction_confidence: 0.95,
      width: 1200,
      height: 1600,
      text_blocks: [
        {
          id: 'tb-41',
          page_id: 'p4-issue-1',
          type: 'heading',
          raw_text: 'USTOZ-SHOGIRD AN’ANASI – KELAJAK KAFOLATI',
          cleaned_text: 'Ustoz-shogird an’anasi - kelajak kafolati',
          final_text: 'Ustoz-shogird an’anasini takomillashtirish hamda yosh temiryo‘lchilarga bilim berish',
          reading_order: 1,
          confidence: 0.97
        }
      ],
      images: [],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    },
    {
      id: 'p5-issue-1',
      issue_id: 'issue-2026-08-01',
      page_number: 5,
      original_page_image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1000&auto=format&fit=crop&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&auto=format&fit=crop&q=80',
      raw_text: '5-BET: MADANIYAT, HORDIQ VA E’LONLAR. Temiryo‘lchilar sanatoriyalaridagi sharoitlar va yangi qatnov jadvallari.',
      ocr_text: '5-BET: MADANIYAT, HORDIQ VA E’LONLAR.',
      cleaned_text: '5-bet: Madaniyat, hordiq va foydali e’lonlar.',
      final_text: '5-bet: Temir yo‘l xodimlari uchun dam olish maskanlari hamda dolzarb e’lonlar va poyezdlar harakat jadvalidagi o‘zgarishlar.',
      audio_url: '/api/audio/sample-p5.mp3',
      audio_duration: 155,
      processing_status: 'ready',
      extraction_confidence: 0.98,
      width: 1200,
      height: 1600,
      text_blocks: [
        {
          id: 'tb-51',
          page_id: 'p5-issue-1',
          type: 'heading',
          raw_text: 'TEMIRYO‘LCHILAR SHIFOXONASI VA DAM OLISH MASKANLARI',
          cleaned_text: 'Temiryo‘lchilar shifoxonasi va dam olish maskanlari',
          final_text: 'Temiryo‘lchilar shifoxonalari hamda dam olish maskanlariga imtiyozli yo‘llanmalar',
          reading_order: 1,
          confidence: 0.99
        }
      ],
      images: [],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    }
  ]
};

export const DEMO_ARTICLES: Record<string, Article[]> = {
  'issue-2026-08-01': [
    {
      id: 'art-1',
      issue_id: 'issue-2026-08-01',
      title: 'Respublika Bo‘ylab Yangi Tezyurar Poyezdlar Qatnovi Yo‘lga Qo‘yildi',
      slug: 'yangi-tezyurar-poyezdlar',
      category: 'Temiryo‘l yangiliklari',
      author: 'Jamshid Rahimov',
      summary: 'Toshkent va viloyat markazlari o‘rtasida qatnaydigan yangi zamonaviy poyezdlar yo‘lovchilar va imkoniyati cheklangan shaxslar uchun barcha raqamli qulayliklarga ega.',
      cleaned_text: 'Bugun Toshkent Markaziy vokzalidan yangi yo‘nalish bo‘yicha tezyurar poyezd birinchi qatnovini amalga oshirdi. Poyezd tarkibida barcha zamonaviy qulayliklar mavjud.',
      final_text: 'Bugun Toshkent Markaziy vokzalidan yangi yo‘nalish bo‘yicha tezyurar poyezd birinchi qatnovini muvaffaqiyatli amalga oshirdi. Poyezd tarkibida barcha zamonaviy qulayliklar, jumladan keng o‘rindiqlar, konditsioner tizimi, hamda imkoniyati cheklangan yo‘lovchilar uchun maxsus moslamalar va taktil ko‘rsatkichlar o‘rnatilgan. Vokzallarda NFC va ovozli gazeta tizimi yo‘lga qo‘yildi.',
      audio_url: '/api/audio/sample-art-1.mp3',
      summary_audio_url: '/api/audio/sample-art-1-sum.mp3',
      estimated_duration: 180,
      reading_order: 1,
      page_numbers: [1],
      main_image_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
      paragraphs: [
        'Bugun Toshkent Markaziy vokzalidan yangi yo‘nalish bo‘yicha tezyurar poyezd birinchi qatnovini muvaffaqiyatli amalga oshirdi.',
        'Poyezd tarkibida barcha zamonaviy qulayliklar, jumladan keng o‘rindiqlar, konditsioner tizimi, hamda imkoniyati cheklangan yo‘lovchilar uchun maxsus moslamalar mavjud.',
        'Vokzallarda ko‘zi ojiz yo‘lovchilar uchun NFC chipli va ovozli ma’lumot beruvchi raqamli gazeta stendlari o‘rnatildi.'
      ],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    },
    {
      id: 'art-2',
      issue_id: 'issue-2026-08-01',
      title: 'Yo‘lovchilar Xavfsizligi Va Vokzallardagi Audio Ko‘rsatkichlar',
      slug: 'xavfsizlik-va-audio-korsatkichlar',
      category: 'Xavfsizlik',
      author: 'Sardor Ergashev',
      summary: 'Temir yo‘l xavfsizligi va vokzal binolarida ko‘zi ojiz va keksa yo‘lovchilar uchun yaratilgan audio imkoniyatlar.',
      cleaned_text: 'Vokzal hududida va poyezdlarda xavfsizlik qoidalariga amal qilish hamda audio ko‘rsatkichlardan foydalanish.',
      final_text: 'Poyezd harakatlanayotgan vaqtda vagondan chiqishga yoki kirishga urinmang. Barcha vokzal hududida maxsus signallarga va xodimlarning ko‘rsatmalariga amal qiling. Ko‘zi ojiz yo‘lovchilar uchun NFC teginish orqali poyezd va gazeta ovozini eshitish imkoni yaratildi.',
      audio_url: '/api/audio/sample-art-2.mp3',
      summary_audio_url: '/api/audio/sample-art-2-sum.mp3',
      estimated_duration: 150,
      reading_order: 2,
      page_numbers: [2],
      main_image_url: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=800&auto=format&fit=crop&q=80',
      paragraphs: [
        'Poyezd harakatlanayotgan vaqtda vagondan chiqishga yoki kirishga urinmang.',
        'Barcha vokzal hududida maxsus signallarga va xodimlarning ko‘rsatmalariga amal qiling.',
        'Ko‘zi ojiz yo‘lovchilar uchun NFC teginish orqali poyezd va gazeta ovozini eshitish imkoni yaratildi.'
      ],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    },
    {
      id: 'art-3',
      issue_id: 'issue-2026-08-01',
      title: 'Temiryo‘lchilar Kasb Bayramida Mehnat Faxriylariga E’tibor',
      slug: 'kasb-bayrami-va-faxriylar',
      category: 'Xodimlar hayoti',
      author: 'Dilnoza Karimova',
      summary: 'Ko‘p yillar davomida po‘lat izlar xavfsizligini ta’minlagan fidoiy xodimlarga ehtirom ko‘rsatildi.',
      cleaned_text: 'Soha faxriylariga e’tibor va rag‘batlantirish sovg‘alari topshirildi.',
      final_text: 'Temir yo‘l sohasida ko‘p yillar davomida halol va fidoiyan mehnat qilgan faxriylarimizga soha rahbariyati tomonidan faxriy yorliqlar hamda moddiy rag‘batlantirish sovg‘alari topshirildi.',
      audio_url: '/api/audio/sample-art-3.mp3',
      summary_audio_url: '/api/audio/sample-art-3-sum.mp3',
      estimated_duration: 160,
      reading_order: 3,
      page_numbers: [3],
      main_image_url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&auto=format&fit=crop&q=80',
      paragraphs: [
        'Temir yo‘l sohasida ko‘p yillar davomida halol va fidoiyan mehnat qilgan faxriylarimizga soha rahbariyati tomonidan faxriy yorliqlar topshirildi.',
        'Faxriylarimiz tajribasi yosh temiryo‘lchilar uchun katta maktab vazifasini o‘tamoqda.'
      ],
      created_at: '2026-07-31T12:00:00Z',
      updated_at: '2026-08-01T08:00:00Z'
    }
  ]
};

export const DEMO_ANALYTICS: AnalyticsSummary = {
  totalNfcOpens: 1482,
  uniqueSessions: 1120,
  mostListenedIssues: [
    { title: 'Temiryo‘lchi - Avgust Soni', opens: 840, duration: 620 },
    { title: 'O‘zbekiston Temir Yo‘llari Xabarlari', opens: 410, duration: 540 },
    { title: 'Lokomotiv Va Yo‘lovchi', opens: 232, duration: 490 }
  ],
  mostListenedPages: [
    { page_number: 1, issue_title: 'Temiryo‘lchi (Avgust)', count: 910 },
    { page_number: 2, issue_title: 'Temiryo‘lchi (Avgust)', count: 680 },
    { page_number: 3, issue_title: 'Temiryo‘lchi (Avgust)', count: 520 }
  ],
  completionRate: 78.5,
  deviceCategories: [
    { name: 'Mobil telefon (Android/iOS)', percentage: 89 },
    { name: 'Planshet', percentage: 7 },
    { name: 'Kompyuter', percentage: 4 }
  ],
  dailyTrends: [
    { date: '07-28', opens: 110 },
    { date: '07-29', opens: 145 },
    { date: '07-30', opens: 190 },
    { date: '07-31', opens: 280 },
    { date: '08-01', opens: 420 },
    { date: '08-02', opens: 337 }
  ]
};
