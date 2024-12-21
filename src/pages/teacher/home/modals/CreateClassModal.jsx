import React from "react";
import "assets/css/modals";
import Modal from "components/Modal";

export const CreateClassModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <Modal>
        <div className="LogoutModal__content">
           
        </div>
    </Modal>
  );
};
