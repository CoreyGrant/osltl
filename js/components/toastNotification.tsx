import React from 'react';
import {connect} from 'react-redux';
import {setNotification} from '../store/appSlice';

export type ToastNotificationProps = {
    notification: string;
    setNotification: (pl) => void;
}
export class ToastNotification extends React.Component<ToastNotificationProps>{
    constructor(props){
        super(props)
    }
    componentDidUpdate(oldProps){
        if(this.props.notification != oldProps.notification && this.props.notification){
            setTimeout(() => this.props.setNotification(undefined), 3000);
        }
    }
    render(): React.ReactNode {
        return this.props.notification 
            ? <div className="toast-notification">
                <p>{this.props.notification}</p>
            </div>
            : undefined;
    }
}

export default connect((state) => ({
    notification: state.app.notification
}), {
    setNotification
})(ToastNotification)