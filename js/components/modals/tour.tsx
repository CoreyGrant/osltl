import React from 'react';
import Modal, { ModalProps } from '../shared/modal';
import {connect} from 'react-redux';
import { closeModal } from '../../store/modalSlice';
import { RootState } from '../../store/store';
// the tour will be accessible through the first time modal, and another button somewhere
// it will demonstrate app features, and explain where everything is

export enum TourStep{
    Start = 0,
    ManageUsers = 1,
    Account = 2,
    PersonalList = 3,
    Filters = 4,
    Simple = 5,
    DarkMode = 6,
}
export type TourProps = {
    closeModal: () => void;
};
export type TourState = {
    step: TourStep;
}

export class Tour extends React.Component<TourProps, TourState>{
    constructor(props){
        super(props);
        this.state = {
            step: 0
        }
    }
    render(){
        // A modal will open and explain the application, with a series of gifs to show how it works
        return <Modal title="OSLTL tour" fullscreen={true}>
            <div className="tour-container">
                <div className="tour-text">
                    {this.getTourText()}
                    {this.getTourButtons()}
                </div>
                <div className="tour-gif">
                    {this.getTourGif()}
                </div>
            </div>
        </Modal>
    }
    getTourText(){
        switch(this.state.step){
            case TourStep.Start:
                return <div>
                    <h1>Start</h1>
                    <p>Welcome to the OSLTL application tour. This will walk you through the different features of the application.</p>
                    <p>Click next to begin</p>
                </div>
            case TourStep.ManageUsers:
                return <div>
                    <h1>Manage users</h1>
                    <p>You need to add your username in the Manage Users screen. To do this, select Manage Users from the dropdown and enter your username and click Add new. You can add more users, then select which user you are currently viewing by clicking Select on the user.</p>
                    <p>Your skills, quests and diaries will be loaded, along with which tasks you have completed. This will allow your tasks to be automatically ticked off as you complete them, as well as filtering on tasks you have the requirements for.</p>
                </div>
            case TourStep.Account:
                return <div>
                    <h1>Account</h1>
                    <p>If you want to use OSLTL on multiple devices, you can make an account which will save your task lists and app options to a database. You can then log in with the same account elsewhere, with the same personal task lists etc.</p>
                </div>
            case TourStep.PersonalList:
                return <div>
                    <h1>Personal list</h1>
                    <p>The checkboxes beside each task are to add the task to a personal task list. These are the tasks you are currently working on, and are different for each username. You can then filter by Personal Tasks to see only the tasks on this list.</p>
                    </div>
            case TourStep.Filters:
                return <div>
                    <h1>Filters</h1>
                    <p>There are many different filters to narrow down the task list. These include:</p>
                    <ul>
                        <li>Personal tasks: the tasks in your personal task list</li>
                        <li>Able to complete: tasks which you have the requirments for</li>
                        <li>Show completed: include tasks you have already completed</li>
                        <li>Skills: only tasks which use selected skills</li>
                        <li>Area: only tasks which are available in a specific area</li>
                        <li>Difficulty: only tasks of a specific difficulty</li>
                    </ul>
                    <p>You can also reset all filters for a category at once.</p>
                </div>
            case TourStep.Simple:
                return <div>
                    <h1>Simple mode</h1>
                    <p>There is a Simple/Detailed toggle, where Simple only shows the task description, the personal checkbox and an info option to see the full task details.</p></div>
            case TourStep.DarkMode:
                return <div>
                    <h1>Dark mode</h1>
                    <p>There is a Dark Mode, which some users might find easier to use.</p></div>
        }
    }
    getTourGif(){
        if(this.state.step === TourStep.Start){return undefined;}
        return <img src={"/images/tour-step-" + this.state.step + ".gif"}/>
    }
    getTourButtons(){
        return <div>
            {this.state.step !== TourStep.DarkMode ? <button className="btn btn-primary" onClick={() => this.nextClick()}>Next</button> : undefined}
            {this.state.step === TourStep.DarkMode ? <button className="btn btn-primary" onClick={() => this.finishClick()}>Finish</button> : undefined}
        </div>
    }
    nextClick(){
        this.setState({step: this.state.step + 1});
    }
    finishClick(){
        this.props.closeModal();
    }
}

export default connect((state: RootState) => ({
    
}),{
    closeModal
})(Tour)