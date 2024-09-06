import React from 'react';
import { UserDetails } from '../types/user';
import { ModalProps, Modal } from './taskDetails';
import { orderedSkills } from './skillFilter';
import {connect} from 'react-redux';
import {AppState} from '../store/appSlice';

export type UserDetailsModalProps = ModalProps & {
    user: UserDetails;
    username: string;
}
class UserDetailsModal<UserDetailsModalProps> extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const user: UserDetails = this.props.user;
        if(!user || !user.skills){return;}
        const skills = user.skills;
        const diaries = user.diaries;
        const quests = user.quests;
        const username: string = this.props.username;
        return <Modal {...this.props} title={username}>
            <div className="user-details">
                <div className="user-details-panel">
                    <div className="user-details-skills">
                        <h3>Skills</h3>
                        <div className="user-details-skill-panel">
                            {orderedSkills.map(os => {
                                return <div className="user-details-skill">
                                    <img src={"icon/" + os + ".webp"}/> {skills[os]}
                                </div>;
                            })}
                            <div className="user-details-skill">
                                <img src={"icon/Total.webp"}/> {Object.values(skills).reduce((p, c) => p+c, 0)}
                            </div>
                        </div>
                    </div>
                    <div className="user-details-side-panel">
                        <div className="user-details-quests">
                            <h3>Quests</h3>
                            <div className="user-details-quest-panel">
                                {quests.map(x => <span className="user-details-quest">{x}</span>)}
                            </div>
                        </div>
                        <div className="user-details-diaries">
                            <h3>Diaries</h3>
                            <div className="user-details-diary-panel">
                                {diaries.map(x => <span className="user-details-diary">{x}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    }
}

export default connect((state: any) => ({
    username: state.app.currentUser,
    user: state.app.users[state.app.currentUser]
}), {

})(UserDetailsModal)