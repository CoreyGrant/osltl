import React from 'react';
import { setDarkMode, setLoggedIn, setSimple } from '../store/appSlice';
import { OptionsPanelProps } from './optionsPanel';
import {connect} from 'react-redux';
import { discordUrl } from '../constants';
import AppIcon from './shared/appIcon';

type InlineOptionsPanelProps = Omit<OptionsPanelProps, 'open'|'onClose'>;
export class InlineOptionsPanel extends React.Component<InlineOptionsPanelProps>{
    discordLinkRef;
    constructor(props){
        super(props);
        this.discordLinkRef = React.createRef();
    }
    render(){
        const {loggedIn, darkMode, simple} = this.props;
        const listItems: any[] = [
            {
                icon: 'tour',
                text: 'Take the tour',
                onClick: () => {this.props.viewTour();}
            },
            {
                icon: 'simple',
                text: simple ? 'Detailed' : 'Simple',
                onClick: () => {this.props.setSimple(!this.props.simple);}
            },
            {
                icon: 'darkMode',
                text: darkMode ? 'Light mode' : 'Dark mode',
                onClick: () => {this.props.setDarkMode(!this.props.darkMode);}
            },
            {divider: true},
            {
                icon: 'account',
                text: 'Manage users',
                onClick: () => {this.props.manageUsers();}
            },
            {
                icon: 'refresh',
                text: 'Refresh data',
                onClick: () => {this.props.refreshData();}
            },
            {
                icon: 'chat',
                text: 'Discord',
                onClick: () => {
                    this.discordLinkRef.current.click();
                }
            },
            {divider: true},
            {
                icon: 'user',
                text: loggedIn ? 'Logout' : 'Login',
                onClick: () => {
                    this.props.loginClick()
                }
            }
        ];
        return <ul className="inline-options-panel">
            <a ref={this.discordLinkRef} href={discordUrl} style={{display: 'none'}} target="_blank"></a>
            {listItems.map(x => {
                if(x.divider){
                    return undefined
                }
                return <li 
                    className="inline-options-panel-item"
                    onClick={() => x.onClick && x.onClick()}>
                    <div className="inline-options-panel-item-icon">
                        {x.icon && <AppIcon name={x.icon} size="lg" ext="svg"/>}
                    </div>
                    <div className="inline-options-panel-item-text">
                        <span>{x.text}</span>
                    </div>
                </li>
            })}
        </ul>
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
})(InlineOptionsPanel)