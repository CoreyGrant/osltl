import React from 'react';
import Modal, { ModalProps } from '../shared/modal';
import {connect} from 'react-redux';
import { addUser, removeUser, setCurrentUser } from '../../store/appSlice';
import { RootState } from '../../store/store';

export type UserSelectModalState = {
    addingUser: boolean;
    addingUsername: string;
    errorMessage?: string;
}
export type UserSelectModalProps = {
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
        return <Modal title="Manage users">
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
                    <div className="form-input">
                        <label htmlFor="new-username">Username</label>
                        <input type="text" id="new-username"
                            onChange={(e) => this.setState({addingUsername: e.target.value})} 
                            value={this.state.addingUsername}/>
                        {this.state.errorMessage && <span className="error-message">{this.state.errorMessage}</span>}
                    </div>
                    <div className="user-select-adding-add">
                        <button onClick={() => this.addNewUser()} className="btn btn-primary">Add</button>
                    </div>
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

export default connect((state: RootState) => ({
    users: Object.keys(state.app.personalTasks),
    currentUser: state.app.currentUser
}), {
    addUser: addUser,
    removeUser: removeUser,
    setCurrentUser: setCurrentUser
})(UserSelectModal);