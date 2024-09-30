import React from 'react';
import { Task, diffVals } from '../../types/task';
import Modal, {ModalProps} from '../shared/modal';

export type TaskDetailsProps = {
    task: Task;
}
export default class TaskDetails extends React.Component<TaskDetailsProps>{
    constructor(props){
        super(props);
    }
    render(){
        const task: Task = this.props.task;
        if(!task){return;}
        const reqs = task.reqs;
        return <Modal {...this.props} title={"Task details"}>
            <div className="task-details">
                <h1>{task.name}</h1>
                <h3>{task.desc}</h3>
                <span><img src={"icon/" + task.diff + "Task.webp"}/>{task.diff} ({diffVals[task.diff]})</span>
                <div className="task-details-container">
                    {reqs.map(a => {
                        return <div className="task-details-detail">
                            <div className="task-details-area">
                            {a?.areas.map((ar, ari) => 
                                {
                                    if(!Array.isArray(ar)){
                                        var showDivider = !(ari + 1 === a.areas.length);
                                        return <div className="task-details-area">
                                            <img className="task-details-area-img" src={"icon/" + ar + "Area.webp"} style={{marginRight: "4px"}} title={ar}></img>{ar}
                                            {showDivider && <p className="task-details-area-divider">/</p>}
                                        </div>    
                                    } else {
                                        return ar.map((subAr, subAri) => {
                                            var showSummer = !(subAri + 1 === ar.length);
                                            return <div style={{display: "flex", flexDirection: 'row'}} className="task-details-area-and">
                                            <img className="task-details-area-img" src={"icon/" + subAr + "Area.webp"} style={{marginRight: "4px"}} title={subAr}></img>{subAr}
                                            {showSummer && <p className="task-details-area-divider">+</p>}
                                        </div>
                                        })
                                    }
                                })}
                            </div>
                            <div className="task-details-reqs">
                                {Object.keys(a?.skills || {}).map(x => <span className="task-details-skills">
                                    <img src={"icon/" + x.replace(" ", "") + ".webp"} title={x} style={{marginRight: "4px"}}></img>{a.skills[x]}
                                </span>)}
                                {a?.quests?.map(x => <span className="task-details-quest">
                                    <img src="icon/Quest.png" title={x} style={{marginRight: "4px"}}></img>{x}
                                </span>)}
                                {a?.diary?.map(x => <span className="task-details-diary">
                                    <img src="icon/Diary.webp" title={x} style={{marginRight: "4px"}}></img>{x}
                                </span>)}
                                {Object.keys(a?.kourend || {}).map(x => <span className="task-details-kourend">
                                    <img src={"icon/Favour.webp"} title={x} style={{marginRight: "4px"}}></img>{x} {a.kourend[x]}%
                                </span>)}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </Modal>
    }
}

