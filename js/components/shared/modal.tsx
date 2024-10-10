import React from 'react';
import {connect} from 'react-redux';
import { closeModal } from '../../store/modalSlice';
import AppIcon from './appIcon';

export enum AppModal{
    Account = 1,
    FirstLoad = 2,
    TaskDetails = 3,
    Tour = 4,
    UserDetails = 5,
    UserSelect = 6,
    TaskLists = 7,
}

export type ModalProps = {
    closeModal: () => void;
    onClose?: () => void;
    title?: string;
    fullscreen?: boolean;
    children: any;
}
export class Modal extends React.Component<ModalProps>{
    constructor(props){
        super(props);
    }
    render(){
        const fullClass = "modal" + (this.props.fullscreen ? ' modal-fullscreen' : "");
        return <div className="modal-overlay" onClick={() => this.modalClose()}>
             <div className={fullClass} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    {this.props.title ? <h1>{this.props.title}</h1> : null}
                    <span className="modal-close" onClick={() => this.modalClose()}>
                        <AppIcon name="close" ext="svg" size="md"/>
                    </span>
                </div>
                <div className="modal-body">
                    {this.props.children}
                </div>
             </div>
        </div>;
    }
    modalClose(){
        if(this.props.onClose){this.props.onClose();}
        this.props.closeModal();
    }
}

export default connect((state) => ({
}), {
    closeModal
})(Modal);