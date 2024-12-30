import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import { IoWarning } from "react-icons/io5";

export const ClosedClassModal = ({isOpen, onClose, }) =>{

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="SuccessMessageModal__content">
                <IoWarning className="ClosedClassModal__icon"/>
                <p className="SuccessMessageModal__message">This quiz is not available at this time.</p>
                <div className="SuccessMessageModal__actions">
                   <button className="SuccessMessageModal__cancel" onClick={onClose}>
                        Close
                   </button>
                </div>
            </div>
        </Modal>
    );

};