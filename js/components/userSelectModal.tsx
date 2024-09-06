import React from 'react';
import { Modal, ModalProps } from './taskDetails';
import {connect} from 'react-redux';
import { AppState, addUser, removeUser, setCurrentUser } from '../store/appSlice';

export type UserSelectModalState = {
    addingUser: boolean;
    addingUsername: string;
    errorMessage?: string;
}
export type UserSelectModalProps = ModalProps & {
    users: string[];
    currentUser: string;
    addUser: (pl) => void;
    removeUser: (pl) => void;
    setCurrentUser: (pl) => void;
};
class UserSelectModal extends React.Component<UserSelectModalProps, UserSelectModalState>{
    constructor(props){
        super(props);
        this.state = {
            addingUser: false,
            addingUsername: "",
            errorMessage: undefined
        }
    }
    render(){
        return <Modal {...this.props}>
            <div className="user-select">
                <div className="user-select-list">
                    {this.props.users.map(u => {
                        const isCurrent = this.props.currentUser === u;
                        return <div className={"user-select-user" + (this.props.currentUser === u ? " current-user" : "")} >
                            <span>{u}</span>
                            <div className="user-select-user-actions">
                                {isCurrent ? null : <button onClick={() => this.selectUser(u)} className="btn btn-primary">Select</button>}
                                <button onClick={() => this.removeUser(u)} className="btn btn-primary">Remove</button>
                            </div>
                        </div>})}
                </div>
                {this.state.addingUser ? undefined : <div className="user-select-add">
                    <button onClick={() => this.setState({addingUser: true})} className="btn btn-primary">Add new</button>
                </div>}
                {this.state.addingUser ? 
                <div className="user-select-adding">
                    <div className="user-select-adding-input">
                        <input type="text" 
                            onChange={(e) => this.setState({addingUsername: e.target.value})} 
                            value={this.state.addingUsername}/>
                        {this.state.errorMessage && <span className="error-message">{this.state.errorMessage}</span>}
                    </div>
                    <button onClick={() => this.addNewUser()} className="btn btn-primary">Add</button>
                </div> : null}
            </div>
        </Modal>
    }
    addNewUser(){
        const username = this.state.addingUsername;
        if(!username || !username.length){
            this.setState({errorMessage: "Please enter a username"});
            return;
        }
        if(this.props.users.indexOf(username) > -1){
            this.setState({errorMessage: "The user already exists"});
            return;
        }
        this.props.addUser(username);
        this.setState({addingUsername: "", addingUser: false, errorMessage: undefined});
    }
    removeUser(username){
        this.props.removeUser(username);
    }
    selectUser(username){
        this.props.setCurrentUser(username);
    }
}

export default connect((state: any) => ({
    users: Object.keys(state.app.personalTasks),
    currentUser: state.app.currentUser
}), {
    addUser: addUser,
    removeUser: removeUser,
    setCurrentUser: setCurrentUser
})(UserSelectModal);