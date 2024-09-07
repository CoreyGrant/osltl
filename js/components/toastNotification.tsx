import React from 'react';
import {connect} from 'react-redux';
import {setNotification} from '../store/appSlice';
import { ReadableByteStreamControllerCallback } from 'stream/web';

export type ToastNotificationProps = {
    notification: string;
    setNotification: (pl) => void;
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
        if(this.props.notification != oldProps.notification && this.props.notification){
            setTimeout(() => {
                this.props.setNotification(undefined);
                //this.setState({hiding: false});
            }, 5000);
            // this.setState({showing: true});
            // setTimeout(() => this.setState({showing: false}), 5000);
            // setTimeout(() => this.setState({hiding: true}), 25000);
        }
    }
    render(): React.ReactNode {
        let extraClass = "";
        if(this.state.showing){
            extraClass += " show";
        }
        if(this.state.hiding){
            extraClass += " hide";
        }
        return this.props.notification 
            ? <div className={"toast-notification" + extraClass}>
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