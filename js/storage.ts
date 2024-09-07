import { store } from "./store/store";
import { AppUserDetails } from "./types/appUserDetails";

export interface IStorage{
    getDetails(): Promise<AppUserDetails>;
    setDetails(details: AppUserDetails): Promise<void>;
}

export class AppLocalStorage implements IStorage{
    async getDetails(): Promise<AppUserDetails>{
        return {
            personalTasks: this.getpersonalTasks(),
            darkMode: this.getDarkMode(),
            currentUser: this.getCurrentUser(),
            filters: this.getFilters(),
            simple: this.getSimple()
        };
    }
    async setDetails(details: AppUserDetails): Promise<void>{
        this.setpersonalTasks(details.personalTasks);
        this.setDarkMode(details.darkMode);
        this.setCurrentUser(details.currentUser);
        this.setFilters(details.filters);
        this.setSimple(details.simple);
    }
    setpersonalTasks(tasks: {[username: string]: number[]}){
        window.localStorage.setItem('personalTasks', JSON.stringify(tasks || {}));
    }
    getpersonalTasks(){
        return JSON.parse(window.localStorage.getItem('personalTasks') || "{}")
    }
    setCurrentUser(username: string){
        window.localStorage.setItem('currentUser', username);
    }
    getCurrentUser(){
        const item = window.localStorage.getItem('currentUser');
        return (item == "undefined" || item == "null") ? undefined : item;
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
    setDarkMode(darkMode){
        window.localStorage.setItem('darkMode', darkMode ? "true" : "false");
    }
    getDarkMode(){
        return (window.localStorage.getItem("darkMode") || "false") == "true";
    }
    setNotFirstLoad(){
        window.localStorage.setItem('notFirstLoad', 'true');
    }
    getNotFirstLoad(){
        return (window.localStorage.getItem('notFirstLoad') == "true");
    }
}

export const appLocalStorage = new AppLocalStorage();