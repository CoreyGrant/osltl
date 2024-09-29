import React from 'react';
import {Modal, ModalProps} from './taskDetails';
import { appApiService } from '../appApiService';
import {connect} from 'react-redux';
import { AppState, load, setLoggedIn, setNotification } from '../store/appSlice';
import {passwordHelper} from '../../shared/password';

export type AccountModalProps = ModalProps & {
    setLoggedIn: (pl) => void;
    load: (pl) => void;
    darkMode: boolean;
    simple: boolean;
    filters: Filters;
    personalTasks: {[username: string]: number[]},
    currentUser: string;
    loginDefault: boolean;
}

export type AccountModalState = {
    rEmailAddress: string;
    rPassword: string;
    rConfirmPassword: string;
    lEmailAddress: string;
    lPassword: string;
    registering: boolean;
    rEmailAddressError: string;
    lEmailAddressError: string;
    rPasswordError: string;
    lPasswordError: string;
    loginError?: string;
    registerError?: string;
    loginSync: boolean;
};

export class AccountModal extends React.Component<AccountModalProps, AccountModalState>{
    constructor(props){
        super(props);
        this.state = {
            rEmailAddress: "",
            rPassword: "",
            rConfirmPassword: "",
            lEmailAddress: "",
            lPassword: "",
            registering: false,
            rEmailAddressError: undefined,
            lEmailAddressError: undefined,
            rPasswordError: undefined,
            lPasswordError: undefined,
            loginError: undefined,
            registerError: undefined,
            loginSync: false
        }
    }
    componentDidUpdate(oldProps){
        if(oldProps.open !== this.props.open && this.props.open){
            this.setState({registering: !this.props.loginDefault});
        }
    }
    onClose(){
        this.setState({
            rEmailAddress: "",
            rPassword: "",
            rConfirmPassword: "",
            lEmailAddress: "",
            lPassword: "",
            registering: false,
            rEmailAddressError: undefined,
            lEmailAddressError: undefined,
            rPasswordError: undefined,
            lPasswordError: undefined,
            loginError: undefined,
            registerError: undefined,
            loginSync: false,
        });
        this.props.onClose();
    }
    render(){
        const getInputProps = (key: string) => {
            return {
                value: this.state[key],
                onChange: (e) => this.setState({[key]: e.target.value})
            };
        }
        return <Modal open={this.props.open} onClose={() => this.onClose()} title={"Account"}>
            <div className="account-modal">
            {this.state.registering ? undefined : <div className="account-login">
                <h1>Login</h1>
                <div className="form-input">
                    <label htmlFor="acc-log-em">Email address</label>
                    <input type="text" className="account-login-email" id="acc-log-em" {...getInputProps("lEmailAddress")}/>
                    {this.state.lEmailAddressError && <span className="error-message">{this.state.lEmailAddressError}</span>}
                </div>
                <div className="form-input">
                    <label htmlFor="acc-log-pas">Password</label>
                    <input type="password" className="account-login-password" id="acc-log-pad" {...getInputProps("lPassword")}/>
                    {this.state.lPasswordError && <span className="error-message">{this.state.lPasswordError}</span>}
                </div>
                <div className="form-input-inline">
                    <input id="acc-log-sync" type="checkbox" checked={this.state.loginSync} onClick={(e) => this.setState({loginSync: e.target.checked})}/>
                    <label htmlFor="acc-log-sync">Sync local to account?</label>
                </div>
                <p>WARNING - this will set your account to everything set locally, only select if you have made changes while logged out. If you are logging into an existing account on a new device, this will wipe everything saved.</p>
                {this.state.loginError && <p className="error-message">{this.state.loginError}</p>}
                <button className="btn btn-primary" onClick={() => this.login()}>Login</button>
                <p className="account-login-register-text">You can register for an account.</p>
                <button className="btn btn-primary" onClick={() => this.setState({registering: true})}>Register an account</button>
            </div>}
            {this.state.registering ? <div className="account-register">
                <h1>Register</h1>
                <div className="account-register-prompt">   
                    <p>An account allows all settings and your personal task list(s) to be saved for use on multiple devices/platforms</p>
                </div>
                <div className="form-input">
                    <label htmlFor="acc-reg-em">Email address</label>
                    <input type="text" className="account-register-email" id="acc-reg-em" {...getInputProps("rEmailAddress")}/>
                    {this.state.rEmailAddressError && <span className="error-message" dangerouslySetInnerHTML={{__html: this.state.rEmailAddressError}}></span>}
                </div>
                <div className="form-input">
                    <label htmlFor='acc-reg-pas'>Password</label>
                    <input type="password" className="account-register-password" id="acc-reg-pas" {...getInputProps("rPassword")}/>
                    {this.state.rPasswordError && <span className="error-message" dangerouslySetInnerHTML={{__html: this.state.rPasswordError}}></span>}
                </div>
                <div className="form-input">
                    <label htmlFor="acc-reg-cpas">Confirm password</label>
                    <input type="password" className="account-register-confirm-password" id="acc-reg-cpas" {...getInputProps("rConfirmPassword")}/>
                </div>
                <button className="btn btn-primary" onClick={() => this.register()}>Register</button>
                {this.state.registerError && <p className="error-message" dangerouslySetInnerHTML={{__html: this.state.registerError}}></p>}
                <p className="account-register-already-text">Already have an account?</p>
                <button className="btn btn-primary" onClick={() => this.setState({registering: false})}>Switch to login</button>
            </div> : undefined}
            </div>
        </Modal>
    }
    login(){
        const emailAddress = this.state.lEmailAddress;
        const password = this.state.lPassword;
        if(!emailAddress || !emailAddress.length){
            this.setState({lEmailAddressError: "Please enter an email address"});
            return;
        }
        if(!password || !password.length){
            this.setState({lPasswordError: "Please enter a password"});
            return;
        }
        return appApiService.login(emailAddress, password)
            .then(res => {
                if(res){
                    if(this.state.loginSync){
                        // we need to send local data to server, rather than load
                        appApiService.updateUserDetails({
                            currentUser: this.props.currentUser,
                            filters: this.props.filters,
                            darkMode: this.props.darkMode,
                            simple: this.props.simple,
                            personalTasks: this.props.personalTasks
                        }).then(() => {        
                            this.props.setNotification("Logged in");
                            this.props.setLoggedIn(true);
                            this.props.onClose();
                        });
                    } else {
                        appApiService.getUserDetails().then(x => {
                            this.props.load(x);
                        });
                        this.props.setNotification("Logged in");
                        this.props.setLoggedIn(true);
                        this.props.onClose();
                    }
                } else {
                    this.setState({loginError: 'Login failed. Please check details and try again.'})
                }
            })
    }
    register(){
        const emailAddress = this.state.rEmailAddress;
        const password = this.state.rPassword;
        const confirmPassword = this.state.rConfirmPassword;
        //console.log(this.state);
        if(!emailAddress || !emailAddress.length){
            this.setState({rEmailAddressError: "Please enter an email address"});
            return;
        }
        if(!password || !password.length){
            this.setState({rPasswordError: "Please enter a password"});
            return;
        }
        const passwordErrors = passwordHelper.validate(password);
        if(passwordErrors.length){
            this.setState({rPasswordError: passwordErrors.join('<br/>')});
            return;
        }
        if(password !== confirmPassword){
            this.setState({rPasswordError: "Password must match confirm password"});
            return;
        }
        appApiService.register(emailAddress, password)
            .then(res => {
                if(res){
                    // get local details, push to server
                    this.setState({
                        lEmailAddress: emailAddress,
                        lPassword: password,
                        rEmailAddress: "",
                        rPassword: "",
                        rConfirmPassword: "",
                        rPasswordError: "",
                        rEmailAddressError: ""}, () => {
                        const loginRes =  appApiService.login(emailAddress, password)
                        if(loginRes){
                            loginRes.then(() => {
                                appApiService.updateUserDetails({
                                    currentUser: this.props.currentUser,
                                    filters: this.props.filters,
                                    darkMode: this.props.darkMode,
                                    simple: this.props.simple,
                                    personalTasks: this.props.personalTasks
                                }).then(() => {
                                    this.props.setLoggedIn(true);
                                    this.props.onClose();
                                });
                            })
                        }
                        this.setState({
                            lEmailAddress: "",
                            lPassword: ""
                        });
                    })
                } else {
                    this.setState({
                        rEmailAddress: "", 
                        rPassword: "", 
                        rConfirmPassword: "",
                        registerError: "Registration failed",
                        rEmailAddressError: "",
                        rPasswordError: ""
                    });
                }
            })
    }
}

export default connect((state: any) => {
    const appState: AppState = state.app;
    return {
        darkMode: appState.darkMode,
        simple: appState.simple,
        filters: appState.filters,
        personalTasks: appState.personalTasks,
        currentUser: appState.currentUser
    };
}, {
    setLoggedIn,
    load,
    setNotification
})(AccountModal);