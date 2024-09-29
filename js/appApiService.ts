import { appLocalStorage } from "./storage";
import { AppUserDetails } from "./types/appUserDetails";
import {setNotification, setLoggedIn, load} from './store/appSlice';
import { store } from "./store/store";
import {socketClient} from './socket';

export class AppApiService{
    private baseUrl: string = "";
    async login(emailAddress, password): Promise<{result: boolean; userId: number;}>{
        var result = await fetch(this.baseUrl + '/login', {
            method: "POST", 
            body: JSON.stringify({emailAddress, password}),
            headers: {
                "Content-Type": "application/json",
            }})
            .then(x => x.json())
            .then(x => {
                if(x.result){
                    socketClient.connect(x.userId);
                }
                return x.result;
            })
            .catch(x => false);
        return result;
    }
    async logout(): Promise<void>{
        await fetch(this.baseUrl + '/logout', {method: "POST"})
            .then(x => {
                store.dispatch(setNotification("Logged out"));
                store.dispatch(setLoggedIn(false));
                socketClient.disconnect()
            });
    }
    async register(emailAddress, password): Promise<boolean>{
        var result = await fetch(this.baseUrl + '/register', {
            method: "POST",
            body: JSON.stringify({emailAddress, password}),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(x => x.json())
        .then(x => x.result)
        .catch(x => false)
        return result;
    }
    async getUserDetails(): Promise<AppUserDetails>{
        return await fetch(this.baseUrl + '/getUserDetails').then(x => x.json())
            .then(x => {
                console.log("got user details from server", x);
                return x;
            });
    }
    async updateUserDetails(userDetails): Promise<boolean>{
        return await fetch(this.baseUrl + '/updateUserDetails', {
            method: "PUT",
            body: JSON.stringify(userDetails),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(x => x.json()).then(x => {
            if(x.result){
                appLocalStorage.setDetails(userDetails);
                return true;
            } else {
                return false;
            }
        })
        .catch(x => false);
    }
    async loggedIn(): Promise<boolean>{
        return await fetch(this.baseUrl + "/loggedIn")
            .then(x => x.json())
            .then(x => {
                if(x.result){
                    socketClient.connect(x.userId);
                }
                return x.result
            })
            .catch(x => false)
    }
}

export const appApiService = new AppApiService();