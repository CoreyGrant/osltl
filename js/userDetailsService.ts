import { UserDetails } from "./types/user";
const baseUrl = "https://sync.runescape.wiki/runelite/player/";
const userTypeKey = "/STANDARD";

function getCombatLevel(skills){
    let cmbLvl = Math.floor(skills.Prayer/2);
    cmbLvl = (cmbLvl + skills.Hitpoints + skills.Defence)/4;
    const meleeLvl = (skills.Strength + skills.Attack) * 0.325;
    const largestMageRange = Math.max(skills.Ranged, skills.Magic);
    const mageRangeLvl = (Math.floor(largestMageRange/2) + largestMageRange) *0.325;
    return cmbLvl + Math.max(meleeLvl, mageRangeLvl);
  }

export class UserDetailsService{
    counter: number = 0;
    async getDetails(username):Promise<UserDetails>{
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
        return fetch(baseUrl + username + userTypeKey)
            .then(x => x.json())
            .then(x => {
                if(x.code && x.code == "NO_USER_DATA"){return {} as any;}
                delete x.levels["Overall"];
                const combatLevel = getCombatLevel(x.levels);
                x.levels["Combat"] = combatLevel;
                return {
                    leagueTasks: x.league_tasks,
                    skills: x.levels,
                    quests: Object.keys(x.quests).filter(q => x.quests[q] == 2),
                    diaries: Object.keys(x.achievement_diaries).flatMap(d => {
                        var areaDiaries= x.achievement_diaries[d];
                        var completedDiaries = Object.keys(areaDiaries).map(di => ({com: areaDiaries[di], key: di}))
                            .filter(di => di.com.complete).map(di => di.key + " " + d);
                        return completedDiaries;
                    })
                }
            });
    }
    beginAutosync(getUsernames, callback){
        // Five minute update period
        var period = 1000*5*60;
        setInterval(() => {
            const usernames = getUsernames();
            callback(Promise.all(usernames.map(u => this.getDetails(u))))
        }, period);
    }
}

export const userDetailsService = new UserDetailsService();