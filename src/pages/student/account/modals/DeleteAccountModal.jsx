import React, {useState, useEffect } from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from 'components/ButtonGroup';
import { PiWarningCircle } from "react-icons/pi";

export const DeleteAccountModal = ({isOpen, onClose, onDelete }) =>{

     if (!isOpen) return null;

     const [isConfirming, setIsConfirming] = useState(false); 
     const [secondsRemaining, setSecondsRemaining] = useState(20);

     useEffect(() => {
        let timer;
        if (isConfirming && secondsRemaining > 0) {
           
            timer = setInterval(() => {
                setSecondsRemaining((prev) => prev - 1);
            }, 1000);
        } else if (secondsRemaining === 0 && isConfirming) {
           
            onDelete();
            setIsConfirming(false); 
            setSecondsRemaining(20);
        }

        return () => clearInterval(timer); 
    }, [isConfirming, secondsRemaining, onDelete]);

    const handleConfirmDeleteAccount = () => {
        setIsConfirming(true); 
    };

    const handleCancelDeletion = () => {
        setIsConfirming(false); 
        setSecondsRemaining(20); 
    };
    

      
    return(
        <Modal>
            <div className="DeleteAccountModal__content">
                <h2>
                    {isConfirming ? "Deleting Account..." : "Account Deletion"}
                </h2>
                <p className="DeleteAccountModal__content-desc">
                    {isConfirming
                    ? (
                        <>
                          Your account and all its data will be permanently deleted.
                          <br />
                          If you're not sure, you can cancel now within the given time.
                        </>
                      )
                    : "Are you sure you want to delete your account?"}
                </p>
                {!isConfirming && (
                <div className="DeleteAccountModal__note-container">
                    <PiWarningCircle className="DeleteAccountModal__note-icon" />
                    <p className="DeleteAccountModal__content-note">
                    Please note that the account cannot be retrieved back after Deletion.
                    </p>
                </div>
                )}
                <div className="DeleteAccountModal__btn-actions">
                    {isConfirming ? (
                        <div className="DeleteAccountModal__btn-actions">
                            <button
                                type="button"
                                className="ButtonGroup__pass-cancel"
                                onClick={handleCancelDeletion}
                            >
                                Cancel <span className="DeleteAccountModal__delete-line"></span> {secondsRemaining}s
                            </button>
                        </div>
                    ) : (
                        <div className="DeleteAccountModal__btn-actions">
                            <ButtonGroup
                                onCancel={onClose}
                                onSave={handleConfirmDeleteAccount}
                                saveText="Delete"
                                saveButtonColor="#A26768"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};