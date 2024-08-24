import React from 'react';
import { Filter, FilterPanel } from './components/filterPanel';
import { TaskTable } from './components/taskTable';
import { storage } from './storage';
import taskList from '../data/tasks.json';
import { userDetailsService } from './userDetailsService';

export type AppProps = {};
export type AppState = {filters: Filter};
export class App extends React.Component<AppProps, AppState>{
    constructor(props){
        super(props);
        this.state = {
            filters: storage.getFilters(),
            userDetails: {},
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
                    <button onClick={() => this.setState({simple: !this.state.simple})}>{this.state.simple ? 'Simple' : 'Detailed'}</button>
                </span>
                <span>
                    <input type="text" className="app-top-bar-username-input" value={this.state.username} onChange={(e) => this.usernameChange(e)}/>
                    <img src="icon/refresh.png" onClick={() => this.updateUserDetails()} style={{height: "20px", width: "20px"}}/>
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