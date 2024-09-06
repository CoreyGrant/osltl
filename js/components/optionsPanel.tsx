import React from 'react';
import {connect} from 'react-redux';
import {setSimple, setLoggedIn, setDarkMode} from '../store/appSlice';
import { openInTab } from '../helpers';

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
};
export class OptionsPanel extends React.Component<OptionsPanelProps>{
    mouseoutEvent;
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
                icon: darkMode ? 'simpleLight.png' : 'simple.png',
                text: simple ? 'Detailed' : 'Simple',
                onClick: () => this.props.setSimple(!this.props.simple)
            },
            {
                icon: darkMode ? 'darkModeLight.png' : 'darkMode.png',
                text: darkMode ? 'Light mode' : 'Dark mode',
                onClick: () => this.props.setDarkMode(!this.props.darkMode)
            },
            {divider: true},
            {
                icon: darkMode ? 'userLight.png' : 'user.png',
                text: 'Manage users',
                onClick: () => this.props.manageUsers()
            },
            {
                icon: darkMode ? 'refreshLight.png' : 'refresh.png',
                text: 'Refresh data',
                onClick: () => this.props.refreshData()
            },
            {
                icon: darkMode ? 'chatLight.png' : 'chat.png',
                text: 'Discord',
                onClick: () => {
                    this.discordLinkRef.current.click();}
            },
            {divider: true},
            {
                icon: darkMode ? 'userLight.png' : 'user.png',
                text: loggedIn ? 'Logout' : 'Login',
                onClick: () => this.props.loginClick()
            }
        ];
        if(!this.props.open){
            return <a ref={this.discordLinkRef} href="https://discord.gg/8pjZbD4MYg" style={{display: 'none'}} target="_blank"></a>;
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
                        {x.icon && <img src={"icon/" + x.icon} />}
                        </div>
                        <div className="options-panel-item-text"><span>{x.text}</span></div>
                    </li>
                })}
            </ul>    
        </div>
    }
}

export default connect((state) =>({
    loggedIn: state.app.loggedIn,
    simple: state.app.simple,
    darkMode: state.app.darkMode
}), {
    setLoggedIn,
    setSimple,
    setDarkMode
})(OptionsPanel)