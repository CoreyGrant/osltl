export class Storage{
    setPersonalTasks(tasks: number[]){
        window.localStorage.setItem('personal', JSON.stringify(tasks));
    }
    getPersonalTasks(){
        return JSON.parse(window.localStorage.getItem('personal') || "[]")
    }
    setUsername(username: string){
        window.localStorage.setItem('username', username);
    }
    getUsername(){
        return window.localStorage.getItem('username');
    }
    setFilters(filters: any){
        window.localStorage.setItem('filters', JSON.stringify(filters));
    }
    getFilters(){
        return JSON.parse(window.localStorage.getItem('filters') || "{\"areas\":[],\"difficulty\":[],\"skills\":[], \"order\": {\"key\":\"default\", \"desc\": false}}");
    }
    setSimple(simple){
        window.localStorage.setItem('simple', simple ? "true" : "false");
    }
    getSimple(){
        return (window.localStorage.getItem("simple") || "false") == "true";
    }
}

export const storage = new Storage();