import React from 'react';
import { 
    connectedFilterPanel as FilterPanel,
    connectedTabbedFilterPanel as TabbedFilterPanel
} from './components/filterPanel';
import {Filter} from './types/filter';
import TaskTable from './components/taskTable';
import taskList from '../data/tasks.json';
import { userDetailsService } from './userDetailsService';
import { UserDetails } from './types/user';
import {Task} from './types/task';
import UserDetailsModal from './components/userDetails';
import {connect} from 'react-redux';
import {AppState as AppStoreState, updatePersonalTasks, setSimple, setDarkMode, load, loadUserDetails, setLoggedIn} from './store/appSlice';
import UserSelectModal from './components/userSelectModal';
import AccountModal from './components/accountModal';
import { appLocalStorage } from './storage';
import { appApiService } from './appApiService';
import ToastNotification from './components/toastNotification';
import OptionsPanel from './components/optionsPanel'

export type AppProps = {
    personalTasks: {[username: string]: number[]};
    darkMode: boolean;
    userDetails: UserDetails;
    currentUser: string;
    simple: boolean;
    taskList: Task[];
    updatePersonalTasks: (pl) => void;
    setSimple: (pl) => void;
    setDarkMode: (pl) => void;
    load: (pl) => void;
    loadUserDetails: (pl) => void;
    lastUpdated?: Date;
    loggedIn: boolean;
    setLoggedIn: (pl) => void;
};
export type AppState = {
    userModalOpen: boolean;
    userManageModalOpen: boolean;
    accountModalOpen: boolean;
    optionsPanelOpen: boolean;
};
export class App extends React.Component<AppProps, AppState>{
    constructor(props){
        super(props);
        this.state = {
            userModalOpen: false,
            userManageModalOpen: false,
            accountModalOpen: false,
            optionsPanelOpen: false
        }
    }
    componentDidUpdate(oldProps){
        if(oldProps.loggedIn !== this.props.loggedIn){
            if(this.props.loggedIn){
                appApiService.getUserDetails()
                    .then(x => {
                        this.props.load(x)
                        appLocalStorage.setDetails(x);
                        var keys = Object.keys(x.personalTasks || {});
                        this.loadUserDetails(keys);
                    });
            } else {
                appLocalStorage.getDetails()
                    .then(x => {
                        console.log("loading local", x);
                        this.props.load(x)
                        var keys = Object.keys(x.personalTasks);
                        this.loadUserDetails(keys);
                    });
            }
        } else{
            
        }
    }
    componentDidMount(){
        appApiService.loggedIn().then(x => {
            this.props.setLoggedIn(x);
        });
        userDetailsService.beginAutosync(() => Object.keys(this.props.personalTasks), (res) => {
            res.then(ud => {
                const keys = Object.keys(this.props.personalTasks);
                var allUserDetails = ud.reduce((p, c, i) => {
                    return {...p, [keys[i]]: c};
                }, {});
                this.props.loadUserDetails(allUserDetails);
            });
        });
    }
    loadUserDetails(keys){
        Promise.all(keys.map(k => userDetailsService.getDetails(k)))
        .then(ud => {
            var allUserDetails = ud.reduce((p, c, i) => {
                return {...p, [keys[i]]: c};
            }, {});
            this.props.loadUserDetails(allUserDetails);
        })
    }
    render(){
        return <div className={"app-container" + (this.props.darkMode ? " dark-mode" : "")}>
            <ToastNotification/>
            <UserDetailsModal
                open={this.state.userModalOpen}
                onClose={() => this.setState({userModalOpen: false})} 
                />
            <UserSelectModal
                title={"Manage users"}
                open={this.state.userManageModalOpen}
                onClose={() => this.setState({userManageModalOpen: false})}></UserSelectModal>
            <AccountModal
                title="Account"
                open={this.state.accountModalOpen}
                onClose={() => this.setState({accountModalOpen: false})} />
            <OptionsPanel
                open={this.state.optionsPanelOpen}
                onClose={() => this.setState({optionsPanelOpen: false})}
                manageUsers={() => this.manageUsers()}
                refreshData={() => {}}
                loginClick={() => {this.loginClick()}}/>
            {this.props.darkMode ? <link rel="stylesheet" href="css/darkMode.css"/> : null}
            <div className="app-top-bar">
                <span className="app-top-bar-title">OLT: Oldschool League Tasks</span>
                <div className="app-top-bar-right">
                    <span className="app-top-bar-options">
                        <img src={this.props.darkMode ? 'icon/settingsLight.png' : 'icon/settings.png'} onClick={() => this.setState({optionsPanelOpen: true})}/>
                    </span>
                </div>
            </div>
            <FilterPanel></FilterPanel>
            <TabbedFilterPanel></TabbedFilterPanel>
            <TaskTable></TaskTable>
        </div>
    }
    loginClick(){
        this.props.loggedIn ? appApiService.logout() : this.setState({accountModalOpen: true});
    }
    manageUsers(){
        this.setState({userManageModalOpen: true});
    }
    simpleChange(){
        this.props.setSimple(!this.props.simple);
    }
    darkModeChange(){
        var darkModeCssElement = document.getElementById('dark-mode-css');
        if(darkModeCssElement){darkModeCssElement.remove()}
        this.props.setDarkMode(!this.props.darkMode);
    }
    logout(){
        appApiService.logout().then(x => this.props.setLoggedIn(false));
    }
}

export default connect((state: any, b) => ({
    personalTasks: state.app.personalTasks,
    darkMode: state.app.darkMode,
    userDetails: state.app.users[state.app.currentUser] || {},
    simple: state.app.simple,
    taskList: state.app.taskList,
    currentUser: state.app.currentUser,
    lastUpdated: state.app.lastUpdated,
    loggedIn: state.app.loggedIn
}), {
    updatePersonalTasks: updatePersonalTasks,
    setSimple: setSimple,
    setDarkMode: setDarkMode,
    load,
    loadUserDetails,
    setLoggedIn
})(App);