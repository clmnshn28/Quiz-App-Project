import React, { useState } from 'react';
import Modal from "components/Modal";
import ButtonGroup from 'components/ButtonGroup';

export const QuizAnswerKeyPreview = ({ isOpen, onClose, question }) => {
  if (!isOpen || !question) return null;

 

  return (
    <Modal>
      <div className="AnswerKeyPreviewModal__content">
        <h2 className="AnswerKeyModal__header">Answer Key Preview</h2>
        
        <div className="AnswerKeyModal__answer-key-content">
            <h3 className="AnswerKeyModal__answer-key-header">
                {question.question_text}
            </h3>
            
            <p className="AnswerKeyModal__answer-key-answer">
            {question.correct_answer}
            </p>
        </div>

        <div className="AnswerKeyModal__btn-actions-view">
            <button className="AnswerKeyModal__btn-cancel" onClick={onClose}>
                Close
            </button>
        </div>
      </div>
    </Modal>
  );
};
