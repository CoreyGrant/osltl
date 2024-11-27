export type Difficulty ="Easy"|"Medium"|"Hard"|"Elite"|"Master"; 
export type Task = {
    id: number;
    name: string;
    desc: string;
    diff: Difficulty;
    reqs: {
        skills: {[key: string]: number};
        quests: string[];
        diary: string[];
        kourend: {[key: string]: number};
        areas: (string|string[])[]
    }[];
    completed?: boolean;
}
export const diffVals = {"Easy": 10, "Medium": 30, "Hard": 80, "Elite": 200, "Master": 400};