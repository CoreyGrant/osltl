export type UserDetails = {
    leagueTasks: number[];
    skills: {[skill: string]: number};
    quests: string[];
    diaries: string[];
}

export type Users = {
    [username: string]: UserDetails;
}