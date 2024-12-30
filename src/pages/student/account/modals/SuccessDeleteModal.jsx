import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BsTrash3 } from "react-icons/bs";
export const SuccessDeleteModal = ({isOpen, onClose}) =>{

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="SuccessDeleteModal__content">
                <div className="SuccessDeleteModal__icon-content">
                    <BsTrash3 className="SuccessDeleteModal__icon"/>
                    <TbRosetteDiscountCheckFilled className="SuccessDeleteModal__icon-check"/>
                </div>
                <h2 className="SuccessDeleteModal__header">Account Deleted Successfully</h2>
                <p className="SuccessDeleteModal__message">Your account has been permanently deleted.</p>
                <div className="SuccessDeleteModal__actions">
                   <button className="SuccessDeleteModal__cancel" onClick={onClose}>
                        Close
                   </button>
                </div>
            </div>
        </Modal>
    );

};