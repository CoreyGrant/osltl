import React from 'react';
import { Filter } from '../types/filter';
import { UserDetails } from '../types/user';
import { FakeTableDatum, FakeTable } from './fakeTable';
import { Task, diffVals } from '../types/task';
import TaskDetails from './modals/taskDetails';
import {connect} from 'react-redux';
import { AppState, addPersonalTask, removePersonalTask, updatePersonalTasks } from '../store/appSlice';
import { modalManager } from './modals/modalManager';
import { AppModal } from './shared/modal';
import { openModal } from '../store/modalSlice';
import AppIcon from './shared/appIcon';
import { wikiUrl } from '../constants';

function formatLinkText(txt){
    var casedText = txt.toLowerCase().replace(/_/g, " ");
    return casedText.substring(0, 1).toUpperCase() + casedText.substring(1);
}

export type TaskTableProps = {
    filters: Filter;
    currentUser: boolean;
    darkMode: boolean;
    user: UserDetails;
    simple: boolean;
    taskList: Task[];
    personalList: number[];
    addPersonalTask: (pl) => void;
    removePersonalTask: (pl) => void;
    updatePersonalTasks: (pl) => void;
    openModal: (pl) => void;
    filtersCollapsed: boolean;
};
export type TaskTableState = {currentTaskIndices: number[], selectedTask: Task};
class TaskTable extends React.Component<TaskTableProps, TaskTableState>{
    constructor(props: TaskTableProps){
        super(props);
        this.state = {
            selectedTask: null,
            currentTaskIndices: []
        };
    }
    componentDidMount(){
        this.updateFilters();
        modalManager.register(AppModal.TaskDetails, () => <TaskDetails 
            task={this.state.selectedTask}/>)
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
                display: (t) => <span className="d-flex flex-row">
                    <AppIcon name={t.diff + "Task"} ext="webp" props={{style: {marginRight: "4px"}}} size="sm"/>
                    {diffVals[t.diff]}
                </span>
            },
            {
                headerDisplay: () => <b>{this.props.personalList.length}</b>,
                display: (t) => <input 
                    type="checkbox" 
                    onChange={() => this.updatePersonalList(t.id)} 
                    checked={this.props.personalList.indexOf(t.id) > -1} 
                    className="personal-checkbox" 
                    disabled={!this.props.currentUser}/>
            },
            {
                headerDisplay: () => <></>,
                display: (t) =>
                    <AppIcon name="info" ext="svg" size="sm" props={{onClick: () => this.setState({selectedTask: t}, () => this.props.openModal(AppModal.TaskDetails)), style: {cursor: 'pointer'}}} />
            }
        ];
        const data = this.state.currentTaskIndices.map(x => this.props.taskList[x]);
        const rowClasses = {completed: 'completed'};
        return <>
            <div className={"task-table" + (this.props.simple ? " simple" : "") + (this.props.filtersCollapsed ? " filters-collapsed" : "")}>
                <FakeTable 
                    data={data} 
                    schema={schema} 
                    rowClasses={rowClasses}
                    infiniteScroll={{initialAmount: 50, loadAmount: 20}}></FakeTable>
            </div>
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
                            return <div 
                                className="row-detail-area">
                                <AppIcon name={ar + "Area"} ext="webp" props={{style: {marginRight: "4px", height: "initial", width: "16px", marginTop: "1px"}}} size="sm"/>
                                {ar}
                                {showDivider && <p className="row-detail-area-divider">/</p>}
                            </div>    
                        } else {
                            return ar.map((subAr, subAri) => {
                                var showSummer = !(subAri + 1 === ar.length);
                                return <div 
                                    style={{display: "flex", flexDirection: 'row'}} 
                                    className="row-detail-area-and">
                                <AppIcon name={subAr + "Area"} ext="webp" props={{style: {marginRight: "4px", height: "initial", width: "16px", marginTop: "1px"}}} size="sm"/>
                                {subAr}
                                {showSummer && <p className="row-detail-area-divider">+</p>}
                            </div>
                            })
                        }
                    })}
                </div>
                <div className="row-detail-reqs">
                {Object.keys(a?.skills || {}).map(x => <span className="row-detail-skills">
                    <AppIcon name={x.replace(" ", "")} ext="webp" props={{style: {marginRight: '4px'}, title: x}} size="sm"/>
                    {a.skills[x]}
                </span>)}
                {a?.quests?.map(x => <span 
                    className="row-detail-quest">
                    <AppIcon name="Quest" ext="png" size="sm" props={{style: {marginRight: "4px"}, title: x}}/>
                    {x}
                </span>)}
                {a?.diary?.map(x => <span className="row-detail-diary">
                    <AppIcon name="Diary" ext="webp" size="sm" props={{style: {marginRight: "4px"}, title: x}}/>
                    {x}
                </span>)}
                {Object.keys(a?.kourend || {}).map(x => <span className="row-detail-kourend">
                    <AppIcon name="Favour" ext="webp" size="sm" props={{style: {marginRight: "4px"}}}/>{x} {a.kourend[x]}%
                </span>)}
                {/*(a?.links || []).map(x => <span className="row-detail-link">
                    <a href={wikiUrl + x.href} target="_blank">{formatLinkText(x.text)}</a>
                </span>)*/}
                </div>
            </div>
        })
        return <div className="row-details">
            {output}
        </div>
    }
    updatePersonalList(taskId){
        var personalTasks = this.props.personalList;
        if(personalTasks.indexOf(taskId) > -1){
            this.props.removePersonalTask(taskId);
        } else {
            this.props.addPersonalTask(taskId);
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.filters != this.props.filters 
            || prevProps.taskList != this.props.taskList){
            var updatedPersonalTasks = [];
            //console.log("starting personal tasks", this.state.personalTaskList);
            for(var pt of this.props.personalList){
                //console.log("checking if task is complete", pt)
                if(!this.props.taskList.find(t => t.id == pt)?.completed){
                    //console.log("isnt complete, keeping");
                    updatedPersonalTasks.push(pt);
                }
            }
            //console.log("list of personal tasks to keep", updatedPersonalTasks);
            if(updatedPersonalTasks.length !== this.props.personalList.length){
                this.props.updatePersonalTasks(updatedPersonalTasks);//, () => this.updateFilters());
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
            if(filter.search && filter.search.length){
                const filterSearch = filter.search.toLowerCase();
                if(task.name.toLowerCase().indexOf(filterSearch) === -1 && task.desc.toLowerCase().indexOf(filterSearch) === -1){
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
                if(this.props.personalList.indexOf(task.id) === -1){
                    return false;
                }
            }
            if(filter.canComplete && user && user.skills){
                var canComplete = reqs.some(x => {
                    const skills = Object.keys(x.skills || {});
                    const quests = x.quests || [];
                    const diaries = x.diary || [];
                    var skillsOk = skills.every(sk => {
                        if(sk == "Any"){
                            const anyThreshold = x.skills[sk];
                            return Object.keys(user.skills).some(usk => user.skills[usk] >= anyThreshold);
                        } else if(sk == "Base"){
                            const baseThrehold = x.skills[sk];
                            //console.log(task, baseThrehold, user.skills);
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

export default connect(
    (state: any) => ({
        filters: state.app.filters,
        user: state.app.users[state.app.currentUser] || {},
        simple: state.app.simple,
        filtersCollapsed: state.app.filtersCollapsed,
        taskList: state.app.taskList,
        personalList: state.app.personalTasks[state.app.currentUser] || [],
        darkMode: state.app.darkMode,
        currentUser: state.app.currentUser
    }),
    {
        addPersonalTask: addPersonalTask,
        removePersonalTask: removePersonalTask,
        updatePersonalTasks: updatePersonalTasks,
        openModal
    })(TaskTable)