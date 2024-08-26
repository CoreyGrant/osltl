export class UserDetailsService{
    getDetails():Promise<UserDetails>{
        return fetch("https://sync.runescape.wiki/runelite/player/" + this.username + "/STANDARD")
            .then(x => x.json())
            .then(x => ({
                leagueTasks: x.league_tasks,
                skills: x.levels,
                quests: x.quests
            }));
    }
    beginAutosync(callback){
        // Five minute update period
        var period = 1000*5*60;
        setInterval(() => {
            console.log("interval", this.username);
            if(this.username && this.username.length){
                callback(this.getDetails())
            }
        }, period);
    }
    username: string;
    updateUsername(username: string){
        this.username = username;
    }
}

export type UserDetails = {
    leagueTasks: number[];
    skills: {[skill: string]: number};
    quests: {[questName: string] : number}; 
}

export const userDetailsService = new UserDetailsService();