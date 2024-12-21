import React from "react";
import "assets/css/modals";
import Modal from "components/Modal";

export const JoinClassModal = ({ isOpen, onClose, onConfirm }) => {
  // if (!isOpen) return null;

  return (
    <Modal>
        <div className="JoinClassModal__content">
          <h5 class="JoinClassModal__title" >Create a New Class</h5>
          <form>
              <div class="JoinClassModal__form-group">
                  <label for="className" className="JoinClassModal__input-label">Class name (required)</label>
                  <input type="text" class="JoinClassModal__input" id="className" name="class_name" required/>
              </div>
              <div class="JoinClassModal__form-group">
                  <label for="section" class="JoinClassModal__input-label">Section</label>
                  <input type="text" class="JoinClassModal__input" id="section" name="section"/>
              </div>
              <small class="text-muted">Note: A unique join code will be automatically generated for your class.</small>
          </form>
        </div>
    </Modal>
  );
};
