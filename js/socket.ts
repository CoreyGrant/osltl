import {io} from 'socket.io-client';
import { appApiService } from './appApiService';
import { store } from './store/store';
import { load } from './store/appSlice';

export class SocketClient{
    client;
    connect(userId){
        this.client = io();
        this.client.emit('register', userId)
        this.client.on('update', () =>{
            appApiService.getUserDetails()
                .then(x => {
                    store.dispatch(load(x));
                });
        });
    }
}

export const socketClient = new SocketClient();