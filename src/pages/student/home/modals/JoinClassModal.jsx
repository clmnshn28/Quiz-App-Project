import React, { useState } from "react";
import "assets/css/modals";
import Modal from "components/Modal";
import ButtonGroup from 'components/ButtonGroup';

export const JoinClassModal = ({ isOpen, onClose, onConfirm }) => {

  const[classCode, setClassCode] = useState('');

  const handleClassCodeChange = (e) => setClassCode(e.target.value);


  const handleCancelJoinClass = () =>{
    onClose();
    setClassCode('');
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
          <form>
              <div className="JoinClassModal__form-group">
                  <label htmlFor="className" className="JoinClassModal__input-label">Class Join Code</label>
                  <input 
                    type="text" 
                    className="JoinClassModal__input" 
                    id="className" 
                    name="class_name" 
                    value={classCode}
                    onChange={handleClassCodeChange} 
                    required
                    autoComplete="off"
                    />
              </div>
              <div className="JoinClassModal__btn-actions" style={{marginTop:"30px"}}>
                <ButtonGroup
                  onCancel={handleCancelJoinClass}
                  onSave={handleConfirmJoinClass}
                  saveText='Join Class'
                  saveButtonColor='#67A292'
                />
              </div>
          </form>
        </div>
    </Modal>
  );
};
