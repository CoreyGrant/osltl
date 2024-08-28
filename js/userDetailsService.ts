export class UserDetailsService{
    counter: number = 0;
    getDetails():Promise<UserDetails>{
        // console.log("requested update", this.counter);
        // if(this.counter == 0){
        //     this.counter++;
        //     return new Promise((r) => r({
        //         leagueTasks : [],
        //         skills: {},
        //         quests: {}
        //     }));
        // }
        // if(this.counter == 1){
        //     this.counter++;
        //     return new Promise((r) => r({
        //         leagueTasks : [435],
        //         skills: {},
        //         quests: {}
        //     }));
        // }
        // if(this.counter == 2){
        //     this.counter++;
        //     return new Promise((r) => r({
        //         leagueTasks : [442, 435],
        //         skills: {},
        //         quests: {}
        //     }));
        // }
        // if(this.counter == 3){
        //     this.counter++;
        //     return new Promise((r) => r({
        //         leagueTasks : [435, 442, 436],
        //         skills: {},
        //         quests: {}
        //     }));
        // }
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