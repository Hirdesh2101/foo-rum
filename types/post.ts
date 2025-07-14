export interface Post {
    id: string;
    content: string;
    author: {
        name: string;
        avatar?: string;
    };
    timestamp: Date;
    likes: number;
    comments: number;
    shares: number;
    emoji?: string;
}