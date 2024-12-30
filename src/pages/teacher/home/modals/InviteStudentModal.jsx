import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import { TbCopy } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
export const InviteStudentModal = ({isOpen, onClose}) =>{

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="InviteStudentModal__content">
                <span className="InviteStudentModal__close" onClick={onClose}><IoClose/></span>
                <div className="InviteStudentModal__title-container">
                    <h5 className="InviteStudentModal__title" >Invite Students</h5>
                    <p className="InviteStudentModal__sub-desc" >Share this code to the students to give them access.</p>
                </div>
                <div className="InviteStudentModal__input-container">
                    <label className="InviteStudentModal__input-label">Invite Code</label>
                    <div className="InviteStudentModal__input-wrapper">
                        <input 
                            type="text"
                            value="NIGVILLE"
                            readOnly
                            className="InviteStudentModal__input"
                        />
                        <button 
                            className="InviteStudentModal__copy-button"
                            onClick={() => navigator.clipboard.writeText("NIGVILLE")}
                        >
                            <TbCopy className="InviteStudentModal__copy-button-icon"/>
                        </button>
                    </div>
                </div>

            </div>
        </Modal>
    );

};