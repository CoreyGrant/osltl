import React from 'react';
import { 
    connectedFilterPanel as FilterPanel,
    connectedTabbedFilterPanel as TabbedFilterPanel
} from './components/filterPanel';
import TaskTable from './components/taskTable';
import { userDetailsService } from './userDetailsService';
import { UserDetails } from './types/user';
import {Task} from './types/task';
import UserDetailsModal from './components/modals/userDetails';
import {connect} from 'react-redux';
import {AppState as AppStoreState, updatePersonalTasks, setSimple, setDarkMode, load, loadUserDetails, setLoggedIn, setNotification} from './store/appSlice';
import UserSelectModal from './components/modals/userSelectModal';
import AccountModal from './components/modals/accountModal';
import { appLocalStorage } from './storage';
import { appApiService } from './appApiService';
import ToastNotification from './components/shared/toastNotification';
import OptionsPanel from './components/optionsPanel'
import FirstLoadModal from './components/modals/firstLoadModal';
import Tour from './components/modals/tour';
import { modalManager } from './components/modals/modalManager';
import { AppModal } from './components/shared/modal';
import {openModal} from './store/modalSlice';
import { RootState } from './store/store';
import AppIcon from './components/shared/appIcon';
import InlineOptionsPanel from './components/inlineOptionsPanel';
import {Countdown} from './components/countdown';
import PrebuiltTaskLists from './components/modals/prebuiltTaskLists';

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
    setNotification: (pl) => void;
    lastUpdated?: Date;
    loggedIn: boolean;
    setLoggedIn: (pl) => void;
    openModal: (pl) => void;
};
export type AppState = {
    optionsPanelOpen: boolean;
    loginDefault: boolean;
};
export class App extends React.Component<AppProps, AppState>{
    constructor(props){
        super(props);
        this.state = {
            optionsPanelOpen: false,
            loginDefault: true,
        }
    }
    componentDidUpdate(oldProps){
        if(oldProps.loggedIn !== this.props.loggedIn){
            if(this.props.loggedIn){
                appApiService.getUserDetails()
                    .then(x => {
                        this.props.load(x)
                        appLocalStorage.setDetails(x);
                    });
            } else {
                appLocalStorage.getDetails()
                    .then(x => {
                        this.props.load(x)
                    });
            }
        } else{
            
        }
        var oldUsers = Object.keys(oldProps.personalTasks || {});
        var newUsers = Object.keys(this.props.personalTasks || {});
        if(!this.arrayEquals(oldUsers, newUsers)){
            this.loadUserDetails(newUsers);
        }
    }
    arrayEquals(a, b){
        if(a.length !== b.length){return false;}
        for(var item of a){
            if(b.indexOf(item) === -1){
                return false;
            }
        }
        return true;
    }
    componentDidMount(){
        modalManager.register(AppModal.Tour,() => <Tour/>);
        modalManager.register(
            AppModal.FirstLoad,
            () => <FirstLoadModal 
                onClose={() => this.setState({loginDefault: false}, () => appLocalStorage.setNotFirstLoad())}
                loginClick={() => this.setState({loginDefault: true}, () => {
                        appLocalStorage.setNotFirstLoad()
                        this.props.openModal(AppModal.Account)
                    })
                }
                registerClick={() => this.setState({loginDefault: false}, () => {
                        appLocalStorage.setNotFirstLoad();
                        this.props.openModal(AppModal.Account);
                    })
                }
                tourModalClick={() => {
                        appLocalStorage.setNotFirstLoad();
                        this.props.openModal(AppModal.Tour);
                    }
                }
                />
        );
        modalManager.register(AppModal.UserDetails, () => <UserDetailsModal/>);
        modalManager.register(AppModal.UserSelect, () => <UserSelectModal/>);
        modalManager.register(AppModal.Account, () => <AccountModal
            loginDefault={this.state.loginDefault} />);
        modalManager.register(AppModal.TaskLists, () => <PrebuiltTaskLists/>);
        // check to see if user has used the app before
        const notFirstLoad = appLocalStorage.getNotFirstLoad();
        if(!notFirstLoad){
            this.props.openModal(AppModal.FirstLoad);
        }

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
        setTimeout(() => {
            const darkModeCss = document.getElementById('dark-mode-css');
            if(darkModeCss){ darkModeCss.remove(); }
        }, 8000);
    }
    loadUserDetails(keys){
        Promise.all(keys.map(k => userDetailsService.getDetails(k)))
        .then(ud => {
            var allUserDetails = ud.reduce((p, c, i) => {
                return {...p, [keys[i]]: c};
            }, {});
            this.props.loadUserDetails(allUserDetails);
            this.props.setNotification("OSRS account details updated");
        })
    }
    render(){
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const classAddition = (this.props.darkMode ? " dark-mode" : "") + (isMobile ? " mobile" : "")
        return <div className={"app-container" + classAddition}>
            {/* <Countdown></Countdown> */}
            <ToastNotification/>
            {modalManager.current()}
            <OptionsPanel
                open={this.state.optionsPanelOpen}
                onClose={() => this.setState({optionsPanelOpen: false})}
                manageUsers={() => this.props.openModal(AppModal.UserSelect)}
                refreshData={() => this.loadUserDetails(Object.keys(this.props.personalTasks || {}))}
                loginClick={() => {this.loginClick()}}
                viewTour={() => this.props.openModal(AppModal.Tour)}
                viewTaskLists={() => this.props.currentUser && this.props.openModal(AppModal.TaskLists)}/>
            {this.props.darkMode ? <link rel="stylesheet" href="css/darkMode.css"/> : null}
            <div className="app-top-bar">
                <div className="d-flex flex-row">
                <span className="app-top-bar-title">OSLTL</span>
                <p className="app-top-bar-desc">Old School Leagues Task List</p>
                </div>
                <div className="app-top-bar-right">
                    <span className="app-top-bar-options">
                        {this.props.currentUser && <span onClick={() => this.props.openModal(AppModal.UserDetails)} style={{cursor: "pointer"}}><p>User: {this.props.currentUser}</p></span>}
                        <span><p>{this.props.loggedIn ? "Account mode" : "Local mode"}</p></span>
                        <InlineOptionsPanel 
                            manageUsers={() => this.props.openModal(AppModal.UserSelect)}
                            refreshData={() => this.loadUserDetails(Object.keys(this.props.personalTasks || {}))}
                            loginClick={() => {this.loginClick()}}
                            viewTour={() => this.props.openModal(AppModal.Tour)}
                            viewTaskLists={() => this.props.currentUser && this.props.openModal(AppModal.TaskLists)}/>
                        <AppIcon name={'settings'} ext="svg" size="lg" props={{onClick :() => this.setState({optionsPanelOpen: !this.state.optionsPanelOpen}), className:"app-options-icon"}}/>
                    </span>
                </div>
            </div>
            <FilterPanel></FilterPanel>
            <TabbedFilterPanel></TabbedFilterPanel>
            <TaskTable></TaskTable>
        </div>
    }
    loginClick(){
        this.props.loggedIn ? appApiService.logout() : this.props.openModal(AppModal.Account);
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

export default connect((state: RootState, b) => ({
    personalTasks: state.app.personalTasks,
    darkMode: state.app.darkMode,
    userDetails: state.app.users[state.app.currentUser] || {},
    simple: state.app.simple,
    taskList: state.app.taskList,
    currentUser: state.app.currentUser,
    lastUpdated: state.app.lastUpdated,
    loggedIn: state.app.loggedIn,
    _: state.modal.current
}), {
    updatePersonalTasks: updatePersonalTasks,
    setSimple: setSimple,
    setDarkMode: setDarkMode,
    load,
    loadUserDetails,
    setLoggedIn,
    setNotification,
    openModal
})(App);