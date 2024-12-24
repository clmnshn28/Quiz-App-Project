import React from "react";
import "assets/css/modals";
import Modal from "components/Modal";
import ButtonGroup from 'components/ButtonGroup';

import { TbLogout2 } from "react-icons/tb";

export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <Modal>
        <div className="LogoutModal__content">
            <div className="LogoutModal__headers">
                <TbLogout2 className="LogoutModal__modal-icon"/>
                <h2 className="LogoutModal__titles">Confirm Logout</h2>
            </div>
            <p className="LogoutModal__description">Are you sure you want to log out?</p>

            <div className="LogoutModal__actions">
                <ButtonGroup
                    onCancel={onClose}
                    onSave={onConfirm}
                    saveText='Logout'
                    saveButtonColor='#A26768'
                />
            </div>
        </div>
    </Modal>
  );
};
