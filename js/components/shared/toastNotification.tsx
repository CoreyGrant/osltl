import React from 'react';
import {connect} from 'react-redux';
import {setNotification, removeNotification} from '../../store/appSlice';

export type ToastNotificationProps = {
    notifications: string[];
    setNotification: (pl) => void;
    removeNotification: (pl) => void;
}
export type ToastNotificationState = {
}
export class ToastNotification extends React.Component<ToastNotificationProps, ToastNotificationState>{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    componentDidUpdate(oldProps){
        const newNotifications = this.props.notifications.filter(x => oldProps.notifications.indexOf(x) === -1);
        //console.log("new notifications", newNotifications)
        if(newNotifications.length){
            for(var nn of newNotifications){
                setTimeout(() => {
                    this.props.removeNotification(nn);
                }, 5000);
            }}
    }
    render(): React.ReactNode {
        return (this.props.notifications && this.props.notifications.length)
            ? <div className="toast-notifications">
                {this.props.notifications.map(n => <div className={"toast-notification"}>
                    <p>{n}</p>
                </div>)}
            </div>
            : undefined;
    }
}

export default connect((state) => ({
    notifications: state.app.notifications
}), {
    setNotification,
    removeNotification
})(ToastNotification)