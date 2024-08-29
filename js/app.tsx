import React from 'react';
import { Filter, FilterPanel } from './components/filterPanel';
import { TaskTable } from './components/taskTable';
import { storage } from './storage';
import taskList from '../data/tasks.json';
import { UserDetails, userDetailsService } from './userDetailsService';
import {Task} from './types/Task';

export type AppProps = {};
export type AppState = {
    filters: Filter;
    userDetails: UserDetails;
    username: string;
    simple: boolean;
    taskList: Task[];
    lastUpdated: Date;
};
export class App extends React.Component<AppProps, AppState>{
    constructor(props){
        super(props);
        this.state = {
            filters: storage.getFilters(),
            userDetails: {} as any,
            username: storage.getUsername(),
            simple: storage.getSimple(),
            taskList: taskList,
            lastUpdated: null,
            darkMode: storage.getDarkMode(),
        }
    }
    updateUserDetails(){
        if(this.state.username && this.state.username.length){
            userDetailsService.getDetails()
                .then(x => this.setState({userDetails: x, lastUpdated: new Date()}, () => {
                    console.log(this.state.userDetails);
                    const tasks = this.state.taskList;
                    const userLeagueTasks = this.state.userDetails.leagueTasks || [];
                    for(var task of tasks){
                        if(userLeagueTasks.indexOf(task.id) > -1){
                            task.completed = true;
                        } else{
                            task.completed = false;
                        }
                    }
                    //console.log("manual user update");
                    this.setState({taskList: [...tasks]});
                }));
        }
    }
    componentDidMount(){
        userDetailsService.updateUsername(this.state.username);
        this.updateUserDetails();
        userDetailsService.beginAutosync((t) => {
            t.then(x => this.setState({userDetails: x, lastUpdated: new Date()}, () => {
                console.log(this.state.userDetails);
                const tasks = this.state.taskList;
                const userLeagueTasks = this.state.userDetails.leagueTasks || [];
                //console.log("userLeagueTasks", userLeagueTasks);
                for(var task of tasks){
                    if(userLeagueTasks.indexOf(task.id) > -1){
                        //console.log("setting task as complete", task);
                        task.completed = true;
                    } else{
                        task.completed = false;
                    }
                }
                console.log("Autosync user update");
                this.setState({taskList: [...tasks]});
            }));
        })
    }
    render(){
        return <div className={"app-container" + (this.state.darkMode ? " dark-mode" : "")}>
            {this.state.darkMode ? <link rel="stylesheet" href="css/darkMode.css"/> : null}
            <div className="app-top-bar">
                <span className="app-top-bar-title">OLT: Oldschool League Tasks</span>
                <span>
                    <button className="btn btn-sm btn-primary" onClick={() => this.simpleChange()}>{this.state.simple ? 'Detailed' : 'Simple'}</button>
                </span>
                <div className="app-top-bar-right">
                    <span className="app-top-bar-username">
                        <label>User <input type="text" className="app-top-bar-username-input" value={this.state.username} onChange={(e) => this.usernameChange(e)}/><img src={"icon/refresh" + (this.state.darkMode ? "Light" : "") + ".png"} onClick={() => this.updateUserDetails()} style={{height: "20px", width: "20px", marginLeft: "2px", marginRight: "10px", cursor: 'pointer'}} title={this.state.lastUpdated && ("Last updated: " + this.state.lastUpdated.toLocaleString().split(", ")[1])}/></label>
                    </span>
                    <span className="app-top-bar-icons">
                        <a href="https://discord.gg/RwhEHT9qhW" target="_blank"><img src="icon/DiscordLogo.svg" className="app-top-bar-discord"></img></a>
                        <img src={"icon/darkMode" + (this.state.darkMode ? "Light" : "") + ".png"} className="app-top-bar-dark-toggle" title={"Toggle dark mode"} onClick={() => this.darkModeChange()}/>
                    </span>
                </div>
            </div>
            <FilterPanel filterUpdate={(f) => this.filterChange(f)} filters={this.state.filters}></FilterPanel>
            <TaskTable filters={this.state.filters} user={this.state.userDetails} simple={this.state.simple} taskList={this.state.taskList}></TaskTable>
        </div>
    }
    filterChange(f){
        storage.setFilters(f);
        this.setState({filters: f});
    }
    usernameChange(e){
        this.setState({username: e.target.value});
        userDetailsService.updateUsername(e.target.value);
        storage.setUsername(e.target.value);
    }
    simpleChange(){
        this.setState({simple: !this.state.simple}, () => 
            storage.setSimple(this.state.simple));
    }
    darkModeChange(){
        this.setState({darkMode: !this.state.darkMode}, () => 
            storage.setDarkMode(this.state.darkMode));
    }
}