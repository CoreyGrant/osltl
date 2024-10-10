import React from 'react';
import {editorConfig} from '../types/editorConfig';
import { Editor } from './editor';
import { DataTable, Datum } from './table';
import { TaskList, TaskListFile, TaskLists } from './taskLists';

export type AppState = {
    selected: Datum;
    data: Datum[];
    filters: {panic: boolean; manual: boolean};
    refreshing: boolean;
    taskLists: TaskListFile;
    selectingForList?: {key: string, index: number};
    showTaskLists: boolean;
}
export class App extends React.Component<{}, AppState>{
    constructor(props){
        super(props);
        this.state = {
            selected: undefined,
            data: [],
            filters: {panic: false, manual: false},
            refreshing: false,
            taskLists: {},
            selectingForList: undefined,
            showTaskLists: false
        }
    }
    componentDidMount(){
        this.loadData();
        this.loadTaskLists();
    }
    loadData(){
        // load the data
        fetch('/data')
            .then(x => x.json())
            .then(x => this.setState({data: x}));
        
    }
    loadTaskLists(){
        fetch('/taskLists')
            .then(x => x.json())
            .then(x => this.setState({taskLists: x}));
    }
    updateItem(id, v){
        fetch('/data', {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({[id]: v})
        }).then(x => this.loadData());
    }
    saveTaskLists(){
        fetch('/taskLists', {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.state.taskLists)
        });
        this.setState({selectingForList: undefined});
    }
    toggleFilter(key){
        const filters = {...this.state.filters};
        filters[key] = !filters[key];
        this.setState({filters});
    }
    filteredData(){
        const {manual, panic} = this.state.filters
        if(manual && panic){
            return this.state.data.filter(x => x.manual || x.panic);
        } else if(manual){
            return this.state.data.filter(x => x.manual);
        }else if(panic){
            return this.state.data.filter(x => x.panic);
        } else {
            return this.state.data;
        }
        
    }
    refresh(){
        this.setState({refreshing: true}, () => {
            fetch('/refresh', {method: 'PUT'})
                .then(x => this.setState({refreshing: false}, () => this.loadData()));
        })
        
    }
    selectForList(key, index){
        this.setState({selectingForList: {key, index}});
    }
    toggleInList(tId){
        const {key, index} = this.state.selectingForList;
        var newTaskList = {...this.state.taskLists[key][index]};
        var tasks = [...newTaskList.tasks];
        var existingTaskIndex = tasks.indexOf(tId);
        if(existingTaskIndex > -1){
            tasks.splice(existingTaskIndex, 1);
        } else {
            tasks = [...tasks, tId];
        }
        newTaskList.tasks = tasks;
        var newTaskListList = [...this.state.taskLists[key]];
        newTaskListList.splice(index, 1, newTaskList);
        var newTaskListState = {...this.state.taskLists, [key]: newTaskListList};
        this.setState({taskLists: newTaskListState});
    }
    render(){
        const tableWidthString = this.state.selected ? 'w-50' : "w-100";
        //console.log(this.state.data);
        const allTasks = this.state.data.reduce((p,c) => ({...p, [c.id]: c}), {});
        //console.log(allTasks);
        return <div className="d-flex flex-row vh-100 position-relative w-100">
            <div className="position-fixed p-2 d-flex flex-row bg-white" style={{bottom: 0, left: 0, zIndex: "100"}}>
                <div className="d-flex flex-row me-2">
                    <input type="checkbox" checked={this.state.filters.panic} onChange={() => this.toggleFilter('panic')}/><label>Panic</label>
                </div>
                <div className="d-flex flex-row">
                    <input type="checkbox" checked={this.state.filters.manual} onChange={() => this.toggleFilter('manual')}/><label>Manual</label>
                </div>
            </div>
            <div className="position-fixed p-2" style={{bottom: 0, right: 0, zIndex: "100"}}>
                <button type="button" onClick={() => this.refresh()}>Refresh tasks</button>
                {this.state.refreshing && <p>...</p>}
            </div>
            <div className={tableWidthString + " vh-100 position-relative"}>
                <div className="d-flex flex-row">
                <input type="checkbox" checked={this.state.showTaskLists} onChange={() => {
                    if(this.state.showTaskLists){
                        this.setState({showTaskLists: !this.state.showTaskLists, selectingForList: undefined});
                    } else{
                        this.setState({showTaskLists: !this.state.showTaskLists})
                    }
                }}/><label>Task lists</label>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => this.saveTaskLists()}>Save task lists</button>
                {this.state.selectingForList && <p>Selecting for {this.state.selectingForList.key} - {this.state.taskLists[this.state.selectingForList.key][this.state.selectingForList.index].name}</p>}
                </div>
                <DataTable dblClick={(item) => {
                    if(this.state.selectingForList){
                        this.toggleInList(item.id);
                    } else {
                        this.setState({selected: item});
                    }
                }} data={this.filteredData()} selectedItem={this.state.selected} selectedForList={this.state.selectingForList ? this.state.taskLists[this.state.selectingForList.key][this.state.selectingForList.index].tasks : []}></DataTable>
            </div>
            {(!!this.state.selected || !!this.state.showTaskLists) && <div className="w-50 vh-100 position-fixed bg-white p-2 overflow-auto" style={{right: "0", top: "0", borderLeft: "2px solid black"}}>
                {this.state.selected && <div className="parsed-data mb-2">
                    <code>
                        {JSON.stringify(this.state.selected.parsed, null, 2)}
                    </code>
                </div>}
                {this.state.selected && <div className="raw-data mb-2">
                    {this.state.selected.raw}
                </div>}
                {this.state.selected && <Editor config={editorConfig} initialValue={this.state.selected.manual || this.state.selected.parsed} save={(v) => this.saveEditor(this.state.selected.id, v)} exit={() => this.setState({selected: undefined})}></Editor>}
                {this.state.showTaskLists && <TaskLists
                    allTasks={allTasks}
                    taskList={this.state.taskLists}
                    onChange={(tl) => this.setState({taskLists: tl})}
                    selectForList={(key, index) => this.selectForList(key, index)}
                />}
            </div>}
            
        </div>
    }
    saveEditor(id, v){
        this.updateItem(id, v);
        this.setState({selected: undefined});
    }
}