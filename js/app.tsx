import React from 'react';
import { Filter, FilterPanel } from './components/filterPanel';
import { Task, TaskTable } from './components/taskTable';
import { storage } from './storage';
import taskList from '../data/tasks.json';
import { UserDetails, userDetailsService } from './userDetailsService';

export type AppProps = {};
export type AppState = {
    filters: Filter;
    userDetails: UserDetails;
    username: string;
    simple: boolean;
    taskList: Task[];
};
export class App extends React.Component<AppProps, AppState>{
    constructor(props){
        super(props);
        this.state = {
            filters: storage.getFilters(),
            userDetails: {} as any,
            username: storage.getUsername(),
            simple: false,
            taskList: taskList
        }
    }
    updateUserDetails(){
        if(this.state.username && this.state.username.length){
            userDetailsService.getDetails(this.state.username)
                .then(x => this.setState({userDetails: x}, () => {
                    const tasks = this.state.taskList;
                    const userLeagueTasks = this.state.userDetails.leagueTasks || [];
                    for(var task of tasks){
                        if(userLeagueTasks.indexOf(task.id) > -1){
                            task.completed = true;
                        }
                    }
                    this.setState({taskList: [...tasks]});
                }));
        }
    }
    componentDidMount(){
        this.updateUserDetails();
    }
    render(){
        return <div className="app-container">
            <div className="app-top-bar">
                <span className="app-top-bar-title">Old School Leagues Task List</span>
                <span>
                    <button onClick={() => this.setState({simple: !this.state.simple})}>{this.state.simple ? 'Switch to detailed' : 'Switch to simple'}</button>
                </span>
                <span>
                    <label>Username <input type="text" className="app-top-bar-username-input" value={this.state.username} onChange={(e) => this.usernameChange(e)}/></label>
                    <img src="icon/refresh.png" onClick={() => this.updateUserDetails()} style={{height: "20px", width: "20px", marginLeft: "2px", marginRight: "10px", cursor: 'pointerS'}}/>
                    <a href="https://discord.gg/RwhEHT9qhW"><img src="icon/DiscordLogo.svg" style={{height: "20px"}}></img></a>
                </span>
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
        storage.setUsername(e.target.value);
    }
}