import React from 'react';
import { ModalProps, Modal } from './taskDetails';
import {connect} from 'react-redux';
import { addUser } from '../store/appSlice';
import { discordUrl } from '../constants';

export type FirstLoadModalProps = ModalProps & {
    addUser: (pl) => void;
    loginClick: () => void;
    registerClick: () => void;
};
export type FirstLoadModalState = {
    username: string;
};
export class FirstLoadModal extends React.Component<FirstLoadModalProps>{
    constructor(props){
        super(props);
        this.state = {
            username: ""
        };
    }
    render(){
        return <Modal {...this.props} title="OSLTL Setup">
            <div className="first-load-modal">
                <h1>Welcome to OSLTL</h1>
                <h3>The Old School Leagues Task List</h3>
                <div className="first-load-modal-username">
                    <p>To get started, enter your OSRS username. Multiple users can be added via Manage users.</p>
                    <input type="text" value={this.state.username} onChange={(e) => this.usernameChange(e.target.value)}/>
                </div>
                <div className="first-load-modal-info">
                <p>There is a <a href={discordUrl} target="_blank">Discord server</a> for feedback, bug reports and feature requests. Feel free to drop by and say hi!</p>
                </div>
                <div className="first-load-modal-account">
                    <p>You can make an account to use the app across multiple devices. You can also use it locally on a single device.</p>
                    <p>If you already have an account you can log in, or you can register. If you just want to use the app on one device, you can get started locally. At any point you can login/register to save your local details for use elsewhere.</p>
                    <div className="first-load-modal-login-buttons">
                        <button className="btn btn-primary" onClick={() => this.loginClick()} style={{marginRight: "4px"}}>Login</button>
                        <button className="btn btn-primary" onClick={() => this.registerClick()} style={{marginRight: "4px"}}>Register</button>
                        <button onClick={() => this.getStarted()} className="btn btn-primary">Get started locally</button>
                    </div>
                </div>
            </div>
        </Modal>
    }
    loginClick(){
        this.props.loginClick();
    }
    registerClick(){
        if(this.state.username && this.state.username.length){
            this.props.addUser(this.state.username)
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
}

export default connect((state) => ({

}), {
    addUser
})(FirstLoadModal)