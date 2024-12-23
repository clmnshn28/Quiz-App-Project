import React, { useState } from "react";
import "assets/css/modals";
import Modal from "components/Modal";
import ButtonGroup from 'components/ButtonGroup';
import { RiErrorWarningLine } from "react-icons/ri";

export const JoinClassModal = ({ isOpen, onClose, onConfirm, error, setError  }) => {

  const[classCode, setClassCode] = useState('');

  const handleClassCodeChange = (e) =>{ 
    setClassCode(e.target.value)
    setError(null);
  };


  const handleCancelJoinClass = () =>{
    onClose();
    setClassCode('');
    setError(null);
  }

  const handleConfirmJoinClass = () =>{
    onConfirm(classCode);
    setClassCode('');
  }


  if (!isOpen) return null;

  return (
    <Modal>
        <div className="JoinClassModal__content" style={{width:'500px'}}>
          <h5 className="JoinClassModal__title" >Join a Class</h5>
  
              <div className="JoinClassModal__form-group">
                  <label htmlFor="className" className="JoinClassModal__input-label">Class Join Code</label>
                  <input 
                    type="text" 
                    className="JoinClassModal__input" 
                    id="className" 
                    name="class_name" 
                    value={classCode}
                    onChange={handleClassCodeChange} 
                    autoComplete="off"
                    />
              </div>
              {error && (
                <div
                  className="JoinClassModal__error-message"
                >
                  <RiErrorWarningLine  className="JoinClassModal__error-icon"/>
                  {error}
                </div>
              )}
              <div className="JoinClassModal__btn-actions" style={{marginTop:"30px"}}>
                <ButtonGroup
                  onCancel={handleCancelJoinClass}
                  onSave={handleConfirmJoinClass}
                  saveText='Join Class'
                  saveButtonColor='#67A292'
                />
              </div>
     
        </div>
    </Modal>
  );
};
