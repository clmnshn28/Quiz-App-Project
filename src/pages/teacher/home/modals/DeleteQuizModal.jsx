import React from "react";
import "assets/css/modals/DeleteQuestionModal.css";
import ButtonGroup from 'components/ButtonGroup';
import Modal from 'components/Modal';
import { PiWarningCircle } from "react-icons/pi";

export const DeleteQuizModal = ({ isOpen, onClose, onConfirm, quizName }) => {
    if (!isOpen) return null;
    
    return (
         <Modal>
            <div className="delete-modal-container">   
                <h3 className="delete-modal-title">Quiz Deletion</h3>
                <p className="DeleteAccountModal__content-desc">Are you sure you want to delete <strong>"{quizName}"</strong>?</p>
                <div className="DeleteAccountModal__note-container">
                    <PiWarningCircle className="DeleteAccountModal__note-icon" />
                    <p className="DeleteAccountModal__content-note">
                        Please note that the quiz cannot be retrieved back after Deletion.
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