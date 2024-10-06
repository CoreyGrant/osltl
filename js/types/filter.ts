export type Filter = {
    skills: string[];
    personal: boolean;
    canComplete: boolean;
    showComplete: boolean;
    search: string;
    difficulty: string[];
    areas: string[];
    order?: {
        key?: string;
        desc?: boolean;
    }
}