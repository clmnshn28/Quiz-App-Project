import React from "react";
import "assets/css/modals/DeleteQuestionModal.css";
import ButtonGroup from 'components/ButtonGroup';
import Modal from 'components/Modal';
import { PiWarningCircle } from "react-icons/pi";

export const RemoveStudentModal = ({ isOpen, onClose, onConfirm, studentName }) => {
    if (!isOpen) return null;
    
    return (
         <Modal>
            <div className="delete-modal-container">   
                <h3 className="delete-modal-title">Remove Student</h3>
                <p className="DeleteAccountModal__content-desc">Are you sure you want to remove <strong>"{studentName}"</strong> from this class?</p>
                <div className="DeleteAccountModal__note-container">
                    <PiWarningCircle className="DeleteAccountModal__note-icon" />
                    <p className="DeleteAccountModal__content-note">
                            This action will revoke the student's access to class content.
                    </p>
                </div>
                <div className="DeleteAccountModal__btn-actions">
                    <ButtonGroup
                        onSave={onConfirm}
                        onCancel={onClose}
                        saveText="Delete"
                        saveButtonColor="#B4696A"
                    />
                </div>
            </div>
        </Modal>
       
    );
};