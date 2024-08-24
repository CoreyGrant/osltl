export class UserDetailsService{
    getDetails(username: string):Promise<UserDetails>{
        return fetch("https://sync.runescape.wiki/runelite/player/" + username + "/STANDARD")
            .then(x => x.json())
            .then(x => ({
                leagueTasks: [435, 442],//x.league_tasks,
                skills: x.levels,
                quests: x.quests
            }));
    }
}

export type UserDetails = {
    leagueTasks: number[];
    skills: {[skill: string]: number};
    quests: {[questName: string] : number}; 
}

export const userDetailsService = new UserDetailsService();