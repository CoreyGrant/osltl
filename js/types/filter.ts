export type Filter = {
    skills: string[];
    personal: boolean;
    canComplete: boolean;
    showComplete: boolean;
    difficulty: string[];
    areas: string[];
    order?: {
        key?: string;
        desc?: boolean;
    }
}