import React from 'react';
import {connect} from 'react-redux';
import {setSimple, setLoggedIn, setDarkMode} from '../store/appSlice';
import { openInTab } from '../helpers';
import { discordUrl } from '../constants';
import AppIcon from './shared/appIcon';

type ListItem = {
    icon?: string;
    text?: string;
    onClick?: () => void;
    divider?: boolean;
}
export type OptionsPanelProps = {
    open: boolean;
    onClose: () => void;
    darkMode: boolean;
    simple: boolean;
    loggedIn: boolean;
    setDarkMode: (pl) => void;
    setSimple: (pl) => void;
    setLoggedIn: (pl) => void;
    manageUsers: () => void;
    refreshData: () => void;
    loginClick: () => void;
    viewTour: () => void;
    viewTaskLists: () => void;
};
export class OptionsPanel extends React.Component<OptionsPanelProps>{
    mouseoutEvent;
    panelRef;
    discordLinkRef;
    constructor(props){
        super(props);
        this.panelRef = React.createRef();
        this.discordLinkRef = React.createRef();
    }
    componentDidUpdate(oldProps){
        if(oldProps.open !== this.props.open){
            if(this.props.open){
                this.mouseoutEvent = this.panelRef.current.addEventListener('mouseleave', () => this.props.onClose());
            } else {
                if(this.mouseoutEvent){
                    this.panelRef.current.removeEventListener(this.mouseoutEvent);
                    this.mouseoutEvent = undefined;
                }
            }
        }
    }
    render(){
        const {loggedIn, darkMode, simple} = this.props;
        const listItems: ListItem[] = [
            {
                icon: 'tour',
                text: 'Take the tour',
                onClick: () => {this.props.viewTour(); this.props.onClose();}
            },
            {
                icon: 'simple',
                text: simple ? 'Detailed' : 'Simple',
                onClick: () => {this.props.setSimple(!this.props.simple); this.props.onClose();}
            },
            {
                icon: 'darkMode',
                text: darkMode ? 'Light mode' : 'Dark mode',
                onClick: () => {this.props.setDarkMode(!this.props.darkMode); this.props.onClose();}
            },
            {divider: true},
            {
                icon: 'account',
                text: 'Manage users',
                onClick: () => {this.props.manageUsers(); this.props.onClose();}
            },
            {
                icon: 'refresh',
                text: 'Refresh data',
                onClick: () => {this.props.onClose(); this.props.refreshData();}
            },
            {
                icon: 'prebuilt',
                text: 'Task lists',
                onClick: () => {this.props.viewTaskLists();}
            },
            {
                icon: 'chat',
                text: 'Discord',
                onClick: () => {
                    this.discordLinkRef.current.click();
                    this.props.onClose()
                }
            },
            {divider: true},
            {
                icon: 'user',
                text: loggedIn ? 'Logout' : 'Login',
                onClick: () => {
                    this.props.loginClick()
                    this.props.onClose();
                }
            }
        ];
        if(!this.props.open){
            return <a ref={this.discordLinkRef} href={discordUrl} style={{display: 'none'}} target="_blank"></a>;
        }
        return <div className={"options-panel" + (darkMode ? ' options-panel-dark' : '')} ref={this.panelRef} ><a ref={this.discordLinkRef} href="https://discord.gg/8pjZbD4MYg" style={{display: 'none'}} target="_blank"></a>
            <ul>
                {listItems.map(x => {
                    if(x.divider){
                        return <div className="list-divider"></div>
                    }
                    return <li 
                        className="options-panel-item" 
                        onClick={() => x.onClick && x.onClick()}>
                            <div className="options-panel-item-icon">
                        {x.icon && <AppIcon name={x.icon} size="lg" ext="svg"/>}
                        </div>
                        <div className="options-panel-item-text"><span>{x.text}</span></div>
                    </li>
                })}
            </ul>    
        </div>
    }
}

export default connect((state: any) =>({
    loggedIn: state.app.loggedIn,
    simple: state.app.simple,
    darkMode: state.app.darkMode
}), {
    setLoggedIn,
    setSimple,
    setDarkMode
})(OptionsPanel)