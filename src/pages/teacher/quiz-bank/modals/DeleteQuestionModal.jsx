import React from 'react';
import "assets/css/modals/DeleteQuestionModal.css";
import ButtonGroup from 'components/ButtonGroup';

export const DeleteQuestionModal = ({ onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="delete-modal-container">
                <div className="delete-modal-content">
                    <h3 className="delete-modal-title">Question Deletion</h3>
                    <p className="delete-modal-message">Are you sure you want to delete your question?</p>
                    <p className="delete-modal-submessage">
                        Please note that the question cannot be retrieved back after Deletion.
                    </p>
                    <ButtonGroup
                        onSave={onConfirm}
                        onCancel={onClose}
                        saveText="Delete"
                        saveButtonColor="#B4696A"
                    />
                </div>
            </div>
        </div>
    );
};
