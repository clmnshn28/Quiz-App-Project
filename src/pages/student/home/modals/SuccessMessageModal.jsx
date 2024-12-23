import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";

export const SuccessMessageModal = ({isOpen, onClose, successMessage}) =>{

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="SuccessMessageModal__content">
                <TbRosetteDiscountCheckFilled className="SuccessMessageModal__icon"/>
                <p className="SuccessMessageModal__message">{successMessage}</p>
                <div className="SuccessMessageModal__actions">
                   <button className="SuccessMessageModal__cancel" onClick={onClose}>
                        Close
                   </button>
                </div>
            </div>
        </Modal>
    );

};