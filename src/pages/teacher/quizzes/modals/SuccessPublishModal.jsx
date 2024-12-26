import React from "react";
import { useNavigate } from 'react-router-dom';
import 'assets/css/modals';
import Modal from "components/Modal";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { LuFileChartColumn } from "react-icons/lu";

export const SuccessPublishModal = ({isOpen, onClose}) =>{
    const navigate = useNavigate();

    const handleConfirm = () => {
        onClose();
        navigate('/teacher'); 
        setTimeout(() => {
            navigate('/teacher/quizzes'); 
        }, 500); 
    };

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="SuccessPublishModal__content">
                <div className="SuccessPublishModal__icon-content">
                    <LuFileChartColumn className="SuccessPublishModal__icon"/>
                    <TbRosetteDiscountCheckFilled className="SuccessPublishModal__icon-check"/>
                </div>
                <h2 className="SuccessPublishModal__header">Quiz Published Successfully!</h2>
                <p className="SuccessPublishModal__message">Your quiz has been published and added to the Question Bank.</p>
                <div className="SuccessPublishModal__actions">
                   <button className="SuccessPublishModal__cancel" onClick={handleConfirm}>
                        Close
                   </button>
                   <button className="SuccessPublishModal__go-to" onClick={() => navigate('/teacher/question-bank')} >
                        Go to Question Bank
                   </button>
                </div>
            </div>
        </Modal>
    );

};