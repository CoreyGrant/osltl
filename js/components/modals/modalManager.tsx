import React from 'react';
import {AppModal} from '../shared/modal';
import {store} from '../../store/store';
// Modal manager
// This should manage all the modals in the application
// Modals are registered in each modal file
// They are managed in the modal store slice

export class ModalManager{
    private _modals: Map<AppModal, any> = new Map<AppModal, any>();
    constructor(){
    }
    register(type: AppModal, modal: any){
        this._modals.set(type, modal);
    }
    current(): React.ReactNode | undefined{
        var currentModal = store.getState().modal.current;
        if(currentModal){
            return this._modals.get(currentModal)();
        }
    }
}

export const modalManager = new ModalManager();