import { createSlice } from '@reduxjs/toolkit'
import { appLocalStorage } from '../storage';
import { Filter } from '../types/filter';
import { UserDetails, Users } from '../types/user';
import { Task } from '../types/task';
import taskList from '../../data/tasks.json';
import {current} from 'immer';

export type AppState = {
    filters: Filter;
    users: Users;
    currentUser: string;
    simple: boolean;
    taskList: Task[];
    personalTasks: {[username: string]: number[]};
    filtersCollapsed: boolean;
    darkMode: boolean;
    lastUpdated?: Date;
    loggedIn: boolean;
    notification: string;
}
function debounce(delay) {
    let timer
    return function(callback) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        callback();
      }, delay)
    }
  }

const debouncedUpdateDetails = debounce(3000);
const getDetailsFromState = (state) => { 
    state = current(state);
    return ({
        filters: state.filters,
        currentUser: state.currentUser,
        simple: state.simple,
        darkMode: state.darkMode,
        personalTasks: state.personalTasks
    })};
const remoteUpdate = (state) => {
    // needs to be in here to avoid circular dep
    var { appApiService } = require('../appApiService');
    var { store } = require('./store.ts');

    const details = getDetailsFromState(state);
    const loggedIn = current(state).loggedIn;
    debouncedUpdateDetails(
        loggedIn 
            ? () => {
                appApiService.updateUserDetails(details);
                store.dispatch(setNotification("Saved to account"));
            } : () => {
                appLocalStorage.setDetails(details);
                store.dispatch(setNotification("Saved locally"));
            });
}
export const appSlice = createSlice({
  name: 'app',
  initialState: {
    filters: {order: {}, skills: [], areas: [], difficulty: []}, 
    users: {},
    currentUser: "",
    simple: false,
    taskList: taskList,
    personalTasks: {},
    filtersCollapsed: true,
    darkMode: false,
    lastUpdated: undefined,
    loggedIn: undefined,
    notification: undefined
  } as AppState,
  reducers: {
    load(state, action){
        const data = action.payload;
        state.filters = data.filters || {order: {}, skills: [], areas: [], difficulty: []};
        state.currentUser = data.currentUser;
        state.simple = data.simple || false;
        state.personalTasks = data.personalTasks || {};
        state.darkMode = data.darkMode || false;
    },
    loadUserDetails(state, action){
        const userDetails = action.payload;
        state.users = userDetails;
        state.lastUpdated = new Date();
    },
    updateFilters(state, action){
        const newFilters = action.payload;
        state.filters = newFilters;
        remoteUpdate(state);
    },
    addUser(state, action){
        const username = action.payload;
        // get the user details
        const userDetails = {} as UserDetails;
        state.users[username] = userDetails;
        state.personalTasks[username] = []; 
        if(!state.currentUser || !state.currentUser.length){
            state.currentUser = username;
        }
        remoteUpdate(state);
    },
    removeUser(state, action){
        const username = action.payload;
        delete state.users[username];
        delete state.personalTasks[username];
        remoteUpdate(state);
    },
    setCurrentUser(state, action){
        const currentUser = action.payload;
        state.currentUser = currentUser;
        remoteUpdate(state);
    },
    setDarkMode(state, action){
        const darkMode = action.payload;
        state.darkMode = darkMode;
        remoteUpdate(state);
    },
    setFiltersCollapsed(state, action){
        const filtersCollapsed = action.payload;
        state.filtersCollapsed = filtersCollapsed;
    },
    addPersonalTask(state, action){
        const personalTask = action.payload;
        console.log("reducer adding task", personalTask);
        state.personalTasks[state.currentUser].push(personalTask);
        // update data store with new personal task list
        remoteUpdate(state);
    },
    removePersonalTask(state, action){
        const personalTask = action.payload;
        console.log("reducer removing task", personalTask);
        const personalList = state.personalTasks[state.currentUser]; 
        personalList.splice(personalList.indexOf(personalTask), 1);
        // update data store with new personal task list
        remoteUpdate(state);
    },
    updatePersonalTasks(state, action){
        const personalTasks = action.payload;
        state.personalTasks[state.currentUser] = personalTasks;
        remoteUpdate(state);
    },
    setSimple(state, action){
        const simple = action.payload;
        state.simple = simple;
        remoteUpdate(state);
    },
    setLoggedIn(state, action){
        const loggedIn = action.payload;
        state.loggedIn = loggedIn;
    },
    setNotification(state, action){
        const notification = action.payload;
        state.notification = notification;
    }
  }
});

export const {
    updateFilters,
    addUser,
    removeUser,
    setCurrentUser,
    setDarkMode,
    setFiltersCollapsed,
    addPersonalTask,
    removePersonalTask,
    updatePersonalTasks,
    setSimple,
    load,
    loadUserDetails,
    setLoggedIn,
    setNotification
} = appSlice.actions;

