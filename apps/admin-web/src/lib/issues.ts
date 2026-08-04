export interface NewspaperOption {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
  }
  
  export type IssueStatus =
    | "DRAFT"
    | "PROCESSING"
    | "REVIEW"
    | "PUBLISHED"
    | "FAILED"
    | "ARCHIVED";
  
  export interface IssueListItem {
    id: number;
    newspaper: NewspaperOption;
    issue_number: number;
    year: number;
    publication_date: string;
    title: string;
    slug: string;
    nfc_slug: string;
    nfc_path: string;
    description: string;
    cover_image: string | null;
    page_count: number;
    processing_progress: number;
    processing_error: string;
    estimated_audio_duration: number;
    status: IssueStatus;
    status_display: string;
    is_public: boolean;
    has_pdf: boolean;
    created_by_name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreatedIssue {
    id: number;
    newspaper_id: number;
    issue_number: number;
    year: number;
    publication_date: string;
    title: string;
    description: string;
    slug: string;
    nfc_slug: string;
    status: IssueStatus;
    is_public: boolean;
    created_at: string;
  }