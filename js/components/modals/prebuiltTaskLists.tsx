import React from 'react';
import Modal from '../shared/modal';
import taskLists from '../../../data/taskLists.json';
import {connect} from 'react-redux';
import { RootState } from '../../store/store';
import { updatePersonalTasks } from '../../store/appSlice';

export type PrebuiltTaskListsProps = {
    personalList: number[];
    updatePersonalTasks: (pl) => void;
}
export class PrebuiltTaskLists extends React.Component<PrebuiltTaskListsProps>{
    constructor(props){
        super(props);
    }
    render(){
        const taskListKeys = Object.keys(taskLists);
        return <Modal title="Prebuilt task lists">
            <div className="prebuilt-task-lists">
                {taskListKeys.map(x => {
                    var prebuilts = taskLists[x];
                    return <div className="prebuilt-task-list-section">
                        <h3>{x}</h3>
                        <table>
                            <tbody>
                                {prebuilts.map(pb => <tr>
                                    <td className="p-2 fw-bold">{pb.name}:</td>
                                    <td className="p-2">{pb.desc}</td>
                                    <td className="p-2">{this.getMatchingString(pb.tasks)}</td>
                                    <td className="p-2">
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => this.addListToPersonal(pb.tasks)}>Select</button>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                })}
            </div>
        </Modal>
    }
    addListToPersonal(tl){
        const newList = [...this.props.personalList];
        for(var tId of tl){
            if(newList.indexOf(tId) === -1){
                newList.push(tId);
            }
        }
        this.props.updatePersonalTasks(newList);
    }
    getMatchingString(tl){
        var output = 0;
        var outOf = tl.length;
        for(var tId of tl){
            if(this.props.personalList.indexOf(tId) > -1){
                output++;
            }
        }
        return `${output} of ${outOf}`;
    }
}

export default connect((state: RootState) => ({
    personalList: state.app.personalTasks[state.app.currentUser] || [],
}), {
    updatePersonalTasks
})(PrebuiltTaskLists)