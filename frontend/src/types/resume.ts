export interface ResumeHistory {
    id: number;
    resume_id: number;
    old_content: string;
    new_content: string;
    improved_at: string;
}

export interface  CreateResumeRequest {
    title: string;
    content: string;
}

export interface  GetResumeRequest {
    title: string;
    content: string;
}
export interface  UpdateResumeRequest {
    title: string;
    content: string;
}

export interface  ResumeResponse {
    id: number;
    user_id: number;
    title: string;
    content: string;
    history?: ResumeHistory[];
}

