import React from 'react';
import { Filter } from './filterPanel';
import { storage } from '../storage';
import { UserDetails } from '../userDetailsService';
import { FakeTableDatum, FakeTable } from './fakeTable';
export type Difficulty ="Easy"|"Medium"|"Hard"|"Elite"|"Master"; 
export type Task = {
    id: number;
    name: string;
    desc: string;
    diff: Difficulty;
    reqs: {
        [key: string]: {
            skills: {[key: string]: number};
            quests: string[];
            diary: string[];
            kourend: {[key: string]: number};
        }
    };
    completed?: boolean;
}
const diffVals = {"Easy": 0, "Medium": 1, "Hard": 2, "Elite": 3, "Master": 4};
export type TaskTableProps = {filters: Filter, user: UserDetails, simple: boolean, taskList: Task[]};
export type TaskTableState = {currentTaskIndices: number[], personalTaskList: number[]};
export class TaskTable extends React.Component<TaskTableProps, TaskTableState>{
    constructor(props: TaskTableProps){
        super(props);
        this.state = {
            currentTaskIndices: [],
            personalTaskList: storage.getPersonalTasks()
        };
    }
    componentDidMount(){
        this.updateFilters();
    }
    render(){
        const schema: FakeTableDatum[] = [
            {
                headerDisplay: () => <b>Name</b>,
                display: (t) => <p>{t.name}</p>
            },
            {
                headerDisplay: () => <b>Description</b>,
                display: (t) => <p>{t.desc}</p>
            },
            {
                headerDisplay: () => <b>Details</b>,
                display: (t) => <span>{this.renderDetails(t.reqs)}</span>
            },
            {
                headerDisplay: () => <b>Difficulty</b>,
                display: (t) => <span><img src={"icon/" + t.diff + "Task.webp"} style={{marginRight: "4px"}}/>{t.diff}</span>
            },
            {
                headerDisplay: () => <b>{this.state.personalTaskList.length}</b>,
                display: (t) => <input type="checkbox" onChange={() => this.updatePersonalList(t.id)} checked={this.state.personalTaskList.indexOf(t.id) > -1} className="personal-checkbox"/>
            },
        ];
        const data = this.state.currentTaskIndices.map(x => this.props.taskList[x]);
        const rowClasses = {completed: 'completed'};
        return <div className={"task-table" + (this.props.simple ? " simple" : "")}>
            <FakeTable 
                data={data} 
                schema={schema} 
                rowClasses={rowClasses}></FakeTable>
        </div>
    }
    getAreaFromReq(reqs){
        return Object.keys(reqs).join("/");
    }
    renderDetails(reqs){
        // show the area with its skill/quest reqs
        const areas = Object.keys(reqs).map(x => ({area: x, req: reqs[x]}));
        const output = areas.map(a => {
            return <div className="row-detail">
                <div className="row-detail-area"><img className="row-detail-area-img" src={"icon/" + a.area + "Area.webp"} style={{marginRight: "4px"}} title={a.area}></img>{a.area}</div>
                <div className="row-detail-reqs">
                {Object.keys(a?.req?.skills || {}).map(x => <span className="row-detail-skills">
                    <img src={"icon/" + x.replace(" ", "") + ".webp"} title={x} style={{marginRight: "4px"}}></img>{a.req.skills[x]}
                </span>)}
                {a?.req?.quests?.map(x => <span className="row-detail-quest">
                    <img src="icon/Quest.png" title={x} style={{marginRight: "4px"}}></img>{x}
                </span>)}
                {a?.req?.diary?.map(x => <span className="row-detail-diary">
                    <img src="icon/Diary.webp" title={x} style={{marginRight: "4px"}}></img>{x}
                </span>)}
                {Object.keys(a?.req?.kourend || {}).map(x => <span className="row-detail-kourend">
                    <img src={"icon/Favour.webp"} title={x} style={{marginRight: "4px"}}></img>{x} {a.req.kourend[x]}%
                </span>)}
                </div>
            </div>
        })
        return <div className="row-details">
            {output}
        </div>
    }
    updatePersonalList(taskId){
        var personalTasks = this.state.personalTaskList;
        if(personalTasks.indexOf(taskId) > -1){
            personalTasks = personalTasks.filter(x => x != taskId);
        } else {
            personalTasks = [...personalTasks, taskId];
        }
        this.setState({personalTaskList: personalTasks}, () => this.updateFilters());
        storage.setPersonalTasks(personalTasks);
    }
    componentDidUpdate(prevProps){
        if(prevProps.filters != this.props.filters || prevProps.taskList != this.props.taskList){
            this.updateFilters();
        }
    }
    updateFilters(){
        var taskIndexPairs = this.props.taskList.map((task, i) => ({i, task}));
        var user: UserDetails = this.props.user;
        // filter the tasks
        var filteredTaskIndexPairs = taskIndexPairs.filter((x) => {
            const task = x.task;
            const reqs = task.reqs;
            const filter = this.props.filters;
            const showComplete = filter.showComplete;
            if(user && user.leagueTasks && user.leagueTasks.length && !showComplete){
                if(user.leagueTasks.indexOf(task.id) > -1){
                    return false;
                }
            }
            if(filter.areas && filter.areas.length){
                const areaKeys = Object.keys(reqs);
                const taskHasArea = areaKeys.some(ak => filter.areas.indexOf(ak) > -1);
                if(!taskHasArea){
                    return false;
                }
            }
            if(filter.difficulty && filter.difficulty.length){
                if(filter.difficulty.indexOf(task.diff) === -1){
                    return false;
                }
            }
            if(filter.skills && filter.skills.length){
                const reqValues = Object.values(reqs);
                if(filter.skills.indexOf("Quest") > -1){
                    const quests = reqValues.flatMap(a => a.quests);
                    if(quests.length){
                        return true;
                    }
                }
                const reqSkills = reqValues.flatMap(a => a.skills ? Object.keys(a.skills) : []);
                const reqSkillsMatches = reqSkills.some(rs => filter.skills.indexOf(rs) > -1);
                if(!reqSkillsMatches){
                    return false;
                }
            }
            if(filter.personal){
                if(this.state.personalTaskList.indexOf(task.id) === -1){
                    return false;
                }
            }
            if(filter.canComplete && user && user.skills){
                var canComplete = Object.values(reqs).some(x => {
                    if(!x.skills){return false;}
                    const skills = Object.keys(x.skills);
                    return skills.every(sk => {
                        if(sk == "Any"){
                            return Object.values(user.skills).some(usk => usk >= x.skills[sk]);
                        } else if(sk == "Base"){
                            return Object.values(user.skills).every(usk => usk >= x.skills[sk]);     
                        } else if(sk == "Total"){
                            return x.skills[sk] <= Object.values(user.skills).reduce((p, c) => p + c, 0);
                        }
                        return user.skills[sk] >= x.skills[sk];
                    });
                });
                if(!canComplete){
                    return false;
                }
            }
            return true;
        });
        // order the tasks
        if(this.props.filters.order){
            var key = this.props.filters.order.key;
            var desc = this.props.filters.order.desc;
            console.log(key, desc);
            if(key != "default"){    
                filteredTaskIndexPairs.sort((a, b) => {
                    var aTask = a.task;
                    var bTask = b.task;
                    if(key == "diff"){
                        var aVal = diffVals[aTask.diff];
                        var bVal = diffVals[bTask.diff];
                        if(aVal == bVal){ return 0 }
                        if(aVal > bVal) { return desc ? -1 : 1 }
                        if(aVal < bVal) { return desc ? 1 : -1 }
                    }
                });
            } else {
                if(desc){
                    filteredTaskIndexPairs.reverse();
                }
            }
        }
        var newIndicies = filteredTaskIndexPairs.map(x => x.i);
        this.setState({
            currentTaskIndices: newIndicies
        });
    }
}