import React from 'react';
import { ModalProps}, Modal from '../shared/modal';
import {connect} from 'react-redux';
import { addUser } from '../../store/appSlice';
import { discordUrl } from '../../constants';

export type FirstLoadModalProps = ModalProps & {
    addUser: (pl) => void;
    loginClick: () => void;
    registerClick: () => void;
    tourModalClick: () => void;
};
export type FirstLoadModalState = {
    username: string;
};
export class FirstLoadModal extends React.Component<FirstLoadModalProps, FirstLoadModalState>{
    constructor(props){
        super(props);
        this.state = {
            username: ""
        };
    }
    render(){
        return <Modal {...this.props} title="Welcome to OSLTL">
            <div className="first-load-modal">
                <h3>The old school leagues task list</h3>
                <div className="first-load-modal-username">
                    <p>To get started, please enter your OSRS username</p>
                    <input type="text" value={this.state.username} onChange={(e) => this.usernameChange(e.target.value)}/>
                </div>
                <div className="first-load-modal-info">
                <p>The app has a dark mode which can be toggled. A simple mode is also available, which works much better on small screens.</p>
                <p>There is a <a href={discordUrl} target="_blank">discord</a> for feedback, bug reports and feature requests. Feel free to drop by and say hi!</p>
                </div>
                <div className="first-load-modal-account">
                    <p>You can use the app without an account, but if you want to share your personal task lists and app settings across devices, you will need to make an account</p>
                    <p>If you already have an account, you can log in, or you can register</p>
                    <div className="first-load-modal-login-buttons">
                        <button className="btn btn-primary btn-margin" onClick={() => this.loginClick()}>Login</button>
                        <button className="btn btn-primary" onClick={() => this.registerClick()}>Register</button>
                    </div>
                </div>
                <div className="first-load-modal-get-started">
                    <button onClick={() => this.getStarted()} className="btn btn-primary btn-margin">Get started</button>
                    <button onClick={() => this.getStartedTour()} className="btn btn-primary">Take the tour</button>
                </div>
            </div>
        </Modal>
    }
    loginClick(){
        this.props.loginClick();
    }
    registerClick(){
        if(this.state.username && this.state.username.length){
            this.props.addUser(this.state.username);
        }
        this.props.registerClick();
    }
    usernameChange(u){
        this.setState({username: u});
    }
    getStarted(){
        if(this.state.username && this.state.username.length){
            this.props.addUser(this.state.username)
        }
        this.props.onClose();
    }
    getStartedTour(){
        if(this.state.username && this.state.username.length){
            this.props.addUser(this.state.username)
        }
        this.props.tourModalClick();
    }
}

export default connect((state) => ({

}), {
    addUser
})(FirstLoadModal)