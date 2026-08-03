export type Role = 'super_admin' | 'editor' | 'reviewer';

export type ProcessingStatus = 
  | 'draft' 
  | 'processing' 
  | 'needs_review' 
  | 'approved' 
  | 'published' 
  | 'failed' 
  | 'archived';

export type JobType = 
  | 'pdf_upload'
  | 'page_split'
  | 'text_ocr'
  | 'image_extract'
  | 'article_detect'
  | 'gemini_cleanup'
  | 'tts_generate';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Newspaper {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  newspaper_id: string;
  newspaper_name: string;
  title: string;
  slug: string;
  issue_number: string;
  publication_date: string;
  status: ProcessingStatus;
  cover_image_url: string;
  original_pdf_url?: string;
  page_count: number;
  estimated_audio_duration: number; // in seconds
  nfc_slug: string;
  is_public: boolean;
  processing_progress: number; // 0 to 100
  current_step_text?: string;
  created_by: string;
  approved_by?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  summary?: string;
}

export interface TextBlock {
  id: string;
  page_id: string;
  article_id?: string;
  type: 'heading' | 'subheading' | 'intro' | 'paragraph' | 'caption' | 'sidebar' | 'author';
  raw_text: string;
  cleaned_text: string;
  final_text: string;
  reading_order: number;
  confidence: number;
  bounding_box?: { x: number; y: number; width: number; height: number };
}

export interface MediaAsset {
  id: string;
  issue_id: string;
  page_id: string;
  article_id?: string;
  type: 'page_image' | 'extracted_photo' | 'diagram' | 'thumbnail';
  original_url: string;
  optimized_url: string;
  thumbnail_url: string;
  caption?: string;
  alt_text?: string;
  reading_order: number;
}

export interface Page {
  id: string;
  issue_id: string;
  page_number: number;
  original_page_image_url: string;
  thumbnail_url: string;
  raw_text: string;
  ocr_text: string;
  cleaned_text: string;
  final_text: string;
  audio_url?: string;
  audio_duration: number; // seconds
  processing_status: 'pending' | 'processing' | 'ready' | 'error';
  extraction_confidence: number;
  width: number;
  height: number;
  text_blocks: TextBlock[];
  images: MediaAsset[];
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  issue_id: string;
  title: string;
  slug: string;
  summary: string;
  cleaned_text: string;
  final_text: string;
  category: string;
  author?: string;
  audio_url?: string;
  summary_audio_url?: string;
  estimated_duration: number;
  reading_order: number;
  page_numbers: number[];
  main_image_url?: string;
  paragraphs: string[];
  created_at: string;
  updated_at: string;
}

export interface AudioAsset {
  id: string;
  issue_id: string;
  page_id?: string;
  article_id?: string;
  type: 'issue_intro' | 'page_full' | 'article_full' | 'article_summary';
  provider: 'google_cloud_tts' | 'gemini_tts' | 'browser_speech';
  voice: string;
  speed: number;
  url: string;
  duration: number;
  status: 'pending' | 'ready' | 'failed';
  created_at: string;
}

export interface ProcessingJob {
  id: string;
  issue_id: string;
  page_id?: string;
  job_type: JobType;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface NfcEvent {
  id: string;
  issue_id: string;
  anonymous_session_id: string;
  user_agent_category: string;
  referrer?: string;
  created_at: string;
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  darkMode: boolean;
  reduceMotion: boolean;
  audioOnlyMode: boolean;
  simpleMode: boolean; // Sodda rejim
  readingSpeed: number; // 0.75, 1, 1.25, 1.5, 2
}

export interface AnalyticsSummary {
  totalNfcOpens: number;
  uniqueSessions: number;
  mostListenedIssues: { title: string; opens: number; duration: number }[];
  mostListenedPages: { page_number: number; issue_title: string; count: number }[];
  completionRate: number; // percentage
  deviceCategories: { name: string; percentage: number }[];
  dailyTrends: { date: string; opens: number }[];
}
