import React from 'react';
import { Filter } from './filterPanel';
import { storage } from '../storage';
import { UserDetails } from '../userDetailsService';
import { FakeTableDatum, FakeTable } from './fakeTable';
import { Task, diffVals } from '../types/task';
import { TaskDetails } from './taskDetails';

export type TaskTableProps = {filters: Filter, user: UserDetails, simple: boolean, taskList: Task[]};
export type TaskTableState = {currentTaskIndices: number[], personalTaskList: number[], selectedTask: Task};
export class TaskTable extends React.Component<TaskTableProps, TaskTableState>{
    constructor(props: TaskTableProps){
        super(props);
        this.state = {
            selectedTask: null,
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
                display: (t) => <span>{this.renderDetails(t)}</span>
            },
            {
                headerDisplay: () => <b>Points - {this.difficultySum()}</b>,
                display: (t) => <span><img src={"icon/" + t.diff + "Task.webp"} style={{marginRight: "4px"}}/>{diffVals[t.diff]}</span>
            },
            {
                headerDisplay: () => <b>{this.state.personalTaskList.length}</b>,
                display: (t) => <input type="checkbox" onChange={() => this.updatePersonalList(t.id)} checked={this.state.personalTaskList.indexOf(t.id) > -1} className="personal-checkbox"/>
            },
            {
                headerDisplay: () => <></>,
                display: (t) => <img 
                    className="row-detail-info"
                    src={"icon/info.webp"} 
                    onClick={() => this.setState({selectedTask: t})}/>
            }
        ];
        const data = this.state.currentTaskIndices.map(x => this.props.taskList[x]);
        const rowClasses = {completed: 'completed'};
        return <>
            <div className={"task-table" + (this.props.simple ? " simple" : "")}>
                <FakeTable 
                    data={data} 
                    schema={schema} 
                    rowClasses={rowClasses}></FakeTable>
            </div>
            <TaskDetails 
                open={!!this.state.selectedTask} 
                onClose={() => this.setState({selectedTask: null})}
                task={this.state.selectedTask}/>
        </>
    }
    renderDetails(t){
        const reqs = t.reqs;
        // show the area with its skill/quest reqs
        const output = reqs.map(a => {
            return <div className="row-detail">
                <div className="row-detail-area">
                {a?.areas.map((ar, ari) => 
                    {
                        if(!Array.isArray(ar)){
                            var showDivider = !(ari + 1 === a.areas.length);
                            return <div className="row-detail-area">
                                <img className="row-detail-area-img" src={"icon/" + ar + "Area.webp"} style={{marginRight: "4px"}} title={ar}></img>{ar}
                                {showDivider && <p className="row-detail-area-divider">/</p>}
                            </div>    
                        } else {
                            return ar.map((subAr, subAri) => {
                                var showSummer = !(subAri + 1 === ar.length);
                                return <div style={{display: "flex", flexDirection: 'row'}} className="row-detail-area-and">
                                <img className="row-detail-area-img" src={"icon/" + subAr + "Area.webp"} style={{marginRight: "4px"}} title={subAr}></img>{subAr}
                                {showSummer && <p className="row-detail-area-divider">+</p>}
                            </div>
                            })
                        }
                    })}
                </div>
                <div className="row-detail-reqs">
                {Object.keys(a?.skills || {}).map(x => <span className="row-detail-skills">
                    <img src={"icon/" + x.replace(" ", "") + ".webp"} title={x} style={{marginRight: "4px"}}></img>{a.skills[x]}
                </span>)}
                {a?.quests?.map(x => <span className="row-detail-quest">
                    <img src="icon/Quest.png" title={x} style={{marginRight: "4px"}}></img>{x}
                </span>)}
                {a?.diary?.map(x => <span className="row-detail-diary">
                    <img src="icon/Diary.webp" title={x} style={{marginRight: "4px"}}></img>{x}
                </span>)}
                {Object.keys(a?.kourend || {}).map(x => <span className="row-detail-kourend">
                    <img src={"icon/Favour.webp"} title={x} style={{marginRight: "4px"}}></img>{x} {a.kourend[x]}%
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
        if(prevProps.filters != this.props.filters 
            || prevProps.taskList != this.props.taskList){
            var updatedPersonalTasks = [];
            //console.log("starting personal tasks", this.state.personalTaskList);
            for(var pt of this.state.personalTaskList){
                //console.log("checking if task is complete", pt)
                if(!this.props.taskList.find(t => t.id == pt).completed){
                    //console.log("isnt complete, keeping");
                    updatedPersonalTasks.push(pt);
                }
            }
            //console.log("list of personal tasks to keep", updatedPersonalTasks);
            if(updatedPersonalTasks.length !== this.state.personalTaskList.length){
                this.setState({personalTaskList: updatedPersonalTasks}, () => this.updateFilters());
                storage.setPersonalTasks(updatedPersonalTasks);
            } else {
                this.updateFilters();
            }
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
                const areaKeys = reqs.flatMap(x => {
                    return x.areas.flatMap(suba =>{
                        if(Array.isArray(suba)){
                            return suba;
                        } else{
                            return [suba];
                        }
                    });
                });
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
                const reqValues = reqs;
                if(filter.skills.indexOf("Quest") > -1){
                    const quests = reqValues.flatMap(a => a.quests || []);
                    if(quests.length){
                        return true;
                    }
                }
                if(filter.skills.indexOf("Diary") > -1){
                    const diary = reqValues.flatMap(a => a.diary || []);
                    if(diary.length){
                        return true;
                    }
                }
                if(filter.skills.indexOf("Favour") > -1){
                    const favour = reqValues.flatMap(x => Object.keys(x.kourend || {}));
                    if(favour.length){
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
                var canComplete = reqs.some(x => {
                    const skills = Object.keys(x.skills || {});
                    const quests = x.quests || [];
                    const diaries = x.diaries || [];
                    var skillsOk = skills.every(sk => {
                        if(sk == "Any"){
                            const anyThreshold = x.skills[sk];
                            return Object.keys(user.skills).some(usk => user.skills[usk] >= anyThreshold);
                        } else if(sk == "Base"){
                            const baseThrehold = x.skills[sk];
                            console.log(task, baseThrehold, user.skills);
                            return Object.keys(user.skills).every(usk => user.skills[usk] >= baseThrehold);     
                        } else if(sk == "Total"){
                            return x.skills[sk] <= Object.values(user.skills).reduce((p, c) => p + c, 0);
                        }
                        return user.skills[sk] >= x.skills[sk];
                    });
                    var questsOk = quests.every(q => user.quests.indexOf(q) > -1);
                    var diariesOk = diaries.every(d => user.diaries.indexOf(d) > -1);
                    return skillsOk && questsOk && diariesOk;
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
    difficultySum(){
        return this.state.currentTaskIndices
            .map(x => diffVals[this.props.taskList[x].diff]).reduce((p, c) => p + c, 0);
    }
}