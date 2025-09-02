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
}