import React, {useState} from "react";
import "assets/css/modals";
import Modal from "components/Modal";
import ButtonGroup from 'components/ButtonGroup';

export const CreateClassModal = ({ isOpen, onClose, onConfirm }) => {
  
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');

  const handleClassNameChange = (e) => setClassName(e.target.value);
  const handleSectionChange = (e) => setSection(e.target.value);

  const handleCancelCreateClass = () =>{
    onClose();   
    setClassName('');  
    setSection('');
  }

  const handleConfirmCreateClass = () =>{
    onConfirm({ className, section });
    setClassName('');  
    setSection('');
  }

  
  if (!isOpen) return null;

  return (
    <Modal>
      <div className="JoinClassModal__content">
             <h5 className="JoinClassModal__title" >Create a New Class</h5>
             <form>
                 <div className="JoinClassModal__form-group">
                     <label htmlFor="className" className="JoinClassModal__input-label">Class name (required)</label>
                     <input 
                       type="text" 
                       className="JoinClassModal__input" 
                       id="className" 
                       name="class_name" 
                       value={className} 
                       onChange={handleClassNameChange}
                       required
                       autoComplete="off"
                       />
                 </div>
                 <div className="JoinClassModal__form-group">
                     <label htmlFor="section" className="JoinClassModal__input-label">Section</label>
                     <input 
                       type="text" 
                       className="JoinClassModal__input" 
                       id="section" 
                       name="section"
                       value={section}
                       onChange={handleSectionChange}
                       autoComplete="off"
                     />
                 </div>
                 <p className="JoinClassModal__note">Note: A unique join code will be automatically generated for your class.</p>
   
                 <div className="JoinClassModal__btn-actions">
                   {/* <button className="JoinClassModal__btn-create">Create Class</button> */}
                   <ButtonGroup
                     onCancel={handleCancelCreateClass}
                     onSave={handleConfirmCreateClass}
                     saveText='Create Class'
                     saveButtonColor='#67A292'
                   />
                 </div>
             </form>
           </div>
    </Modal>
  );
};
