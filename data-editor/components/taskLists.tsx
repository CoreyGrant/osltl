import React from 'react';

export type TaskList = {
    name: string;
    desc: string;
    tasks: number[];
}

export type TaskListFile = {
    [sectionName: string]: TaskList[];
};
const diffVals = {"Easy": 10, "Medium": 40, "Hard": 80, "Elite": 200, "Master": 400};
export type TaskListsProps = {
    taskList: TaskListFile;
    onChange: (tl: TaskListFile) => void;
    selectForList: (key, index) => void;
    allTasks: {[id: number]: {diff: string}};
};
export type TaskListsState = {
    newSection: string;
    newName: string;
    newDesc: string;
};
export class TaskLists extends React.Component<TaskListsProps, TaskListsState>{
    constructor(props){
        super(props);
        this.state = {
            newSection: "",
            newName: "",
            newDesc: ""
        }
    }
    render(){
        var keys = Object.keys(this.props.taskList);
        return <div className="d-flex flex-column">
            {keys.map(x => {
                var list = this.props.taskList[x];
                return <div className="d-flex flex-column">
                    <h3>{x}</h3>
                    {list.map((l, i) => <div className="d-flex flex-column">
                        <div className="d-flex flex-column">
                            <label>Name</label>
                            <input type="text" value={l.name} onChange={(e) => this.updateListName(x, i, e.target.value)}/>
                        </div>
                        <div className="d-flex flex-column">
                            <label>Desc</label>
                            <textarea onChange={(e) => this.updateListDesc(x, i, e.target.value)} value={l.desc}></textarea>
                        </div>
                        <p>Amount: {l.tasks.length} Points: {l.tasks.map(t => diffVals[this.props.allTasks[t].diff]).reduce((p,c)=> p+c, 0)}</p>
                        <button type="button" onClick={() => this.props.selectForList(x, i)} className="btn btn-primary">Select for list</button>
                        <button type="button" onClick={() => this.removeList(x, i)} className="btn btn-warning">Remove</button>
                    </div>)}
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-column">
                            <label>Name</label>
                            <input type="text" value={this.state.newName} onChange={(e) => this.setState({newName: e.target.value})}/>
                        </div>
                        <div className="d-flex flex-column">
                            <label>Desc</label>
                            <textarea onChange={(e) => this.setState({newDesc: e.target.value})} value={this.state.newDesc}></textarea>
                        </div>
                        <button type="button" onClick={() => this.addNewList(x)} className="btn btn-primary">Add new list</button>
                    </div>
                </div>
            })}
            <div>
                <div>
                <label></label>
                <input type="text" value={this.state.newSection} onChange={(e) => this.setState({newSection: e.target.value})}/>
                </div>
                <button type="button" onClick={() => this.addNewSection()} className="btn btn-primary">Add new section</button>
            </div>
        </div>
    }
    addNewSection(){
        if(!this.state.newSection || !this.state.newSection.length){return;}
        var newTl = {...this.props.taskList, [this.state.newSection]: []};
        this.props.onChange(newTl);
        this.setState({newSection: undefined});
    }
    updateListName(k, i, newVal){
        var allLists = this.props.taskList[k];
        var specificList = allLists[i];
        allLists.splice(i, 1, {...specificList, name: newVal});
        var newState = {...this.props.taskList, [k]: allLists}
        this.props.onChange(newState);
    }
    updateListDesc(k, i, newVal){
        var allLists = [...this.props.taskList[k]];
        var specificList = allLists[i];
        allLists.splice(i, 1, {...specificList, desc: newVal});
        var newState = {...this.props.taskList, [k]: allLists}
        this.props.onChange(newState);
    }
    addNewList(k){
        const name = this.state.newName;
        const desc = this.state.newDesc;
        if(!name || !name.length || !desc || !desc.length){return;}
        var newList = {name, desc, tasks: []};
        var allLists = [...this.props.taskList[k], newList];
        var newState = {...this.props.taskList, [k]: allLists};
        this.props.onChange(newState);
        this.setState({newName: "", newDesc: ""})
    }
    removeList(k, i){
        var allLists = [...this.props.taskList[k]];
        allLists.splice(i, 1);
        var newState = {...this.props.taskList, [k]: allLists};
        this.props.onChange(newState);
    }
}