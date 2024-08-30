import React from 'react';
import { Filter, FilterPanel, TabbedFilterPanel } from './components/filterPanel';
import { TaskTable } from './components/taskTable';
import { storage } from './storage';
import taskList from '../data/tasks.json';
import { UserDetails, userDetailsService } from './userDetailsService';
import {Task} from './types/Task';
import { UserDetailsModal } from './components/userDetails';

export type AppProps = {};
export type AppState = {
    filters: Filter;
    userDetails: UserDetails;
    username: string;
    simple: boolean;
    taskList: Task[];
    lastUpdated: Date;
    personalList: number[];
    filtersCollapsed: boolean;
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
            personalList: storage.getPersonalTasks(),
            filtersCollapsed: true,
            userModalOpen: false
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
            <UserDetailsModal 
                user={this.state.userDetails} 
                username={this.state.username}
                open={this.state.userModalOpen}
                onClose={() => this.setState({userModalOpen: false})} 
                />
            {this.state.darkMode ? <link rel="stylesheet" href="css/darkMode.css"/> : null}
            <div className="app-top-bar">
                <span className="app-top-bar-title">OLT: Oldschool League Tasks</span>
                <span>
                    <button className="btn btn-sm btn-primary" onClick={() => this.simpleChange()}>{this.state.simple ? 'Detailed' : 'Simple'}</button>
                </span>
                <div className="app-top-bar-right">
                    <span className="app-top-bar-username">
                        <label>
                            <span 
                                onClick={() => (this.state.username && this.state.username.length) && this.setState({userModalOpen: true})} 
                                style={{cursor: (this.state.userDetails && this.state.userDetails.skills) ? 'pointer' : "initial"}} 
                                title={(this.state.userDetails && this.state.userDetails.skills) ? "Click to view" : undefined}>
                                User
                            </span>
                            <input 
                                type="text" 
                                className="app-top-bar-username-input" 
                                value={this.state.username} 
                                onChange={(e) => this.usernameChange(e)}/>
                            <img 
                                src={"icon/refresh" + (this.state.darkMode ? "Light" : "") + ".png"} 
                                onClick={() => this.updateUserDetails()} 
                                style={{height: "20px", width: "20px", marginLeft: "2px", marginRight: "10px", cursor: 'pointer'}} 
                                title={this.state.lastUpdated && ("Last updated: " + this.state.lastUpdated.toLocaleString().split(", ")[1])}/>
                        </label>
                    </span>
                    <span className="app-top-bar-icons">
                        <a href="https://discord.gg/8pjZbD4MYg" target="_blank"><img src="icon/DiscordLogo.svg" className="app-top-bar-discord"></img></a>
                        <img src={"icon/darkMode" + (this.state.darkMode ? "Light" : "") + ".png"} className="app-top-bar-dark-toggle" title={"Toggle dark mode"} onClick={() => this.darkModeChange()}/>
                    </span>
                </div>
            </div>
            <FilterPanel filterUpdate={(f) => this.filterChange(f)} filters={this.state.filters} counts={{personalList: (this.state.personalList || []).length}}></FilterPanel>
            <TabbedFilterPanel filterUpdate={(f) => this.filterChange(f)} filters={this.state.filters} counts={{personalList: (this.state.personalList || []).length}} collapsedChanged={(col) => this.setState({filtersCollapsed: col})}></TabbedFilterPanel>
            <TaskTable filters={this.state.filters} user={this.state.userDetails} simple={this.state.simple} taskList={this.state.taskList} personalListChange={(pl) => this.setState({personalList: pl})} filtersCollapsed={this.state.filtersCollapsed}></TaskTable>
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
        var darkModeCssElement = document.getElementById('dark-mode-css');
        if(darkModeCssElement){darkModeCssElement.remove()}
        this.setState({darkMode: !this.state.darkMode}, () => 
            storage.setDarkMode(this.state.darkMode));
    }
}