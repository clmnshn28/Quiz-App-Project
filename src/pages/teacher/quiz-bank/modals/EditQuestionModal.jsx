import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { BsCheck2Circle, BsXCircle, BsRecordCircle } from "react-icons/bs";
import { RiRadioButtonFill } from "react-icons/ri";
import CustomDropdown from 'components/CustomDropdown';
import "assets/css/modals/EditQuestionModal.css";
import ButtonGroup from 'components/ButtonGroup';

export const EditQuestionModal = ({ onClose, onSave, initialData = {} }) => {
    const [questionData, setQuestionData] = useState({
        question: initialData.question || '',
        type: initialData.type || 'identification',
        points: initialData.points || '1',
        answers: initialData.answers || [''],
        options: initialData.options || ['']
    });

    const questionTypes = [
        { 
            value: 'identification', 
            title: 'Identification',
            icon: <HiOutlineMenuAlt2 className="question-type-icon" />
        },
        { 
            value: 'true-false', 
            title: 'True or False',
            icon: <BsCheck2Circle className="question-type-icon" />
        },
        {
            value: 'multiple-choice',
            title: 'Multiple Choice',
            icon: <BsRecordCircle className="question-type-icon" />
        }
    ];

    const handleAnswerChange = (index, value) => {
        if (questionData.type === 'multiple-choice') {
            const newOptions = [...questionData.options];
            newOptions[index] = value;
            setQuestionData(prev => ({ ...prev, options: newOptions }));
        } else {
            const newAnswers = [...questionData.answers];
            newAnswers[index] = value;
            setQuestionData(prev => ({ ...prev, answers: newAnswers }));
        }
    };

    const removeOption = (index) => {
        if (questionData.type === 'multiple-choice') {
            const newOptions = questionData.options.filter((_, i) => i !== index);
            setQuestionData(prev => ({ ...prev, options: newOptions }));
        } else {
            const newAnswers = questionData.answers.filter((_, i) => i !== index);
            setQuestionData(prev => ({ ...prev, answers: newAnswers }));
        }
    };

    const addOption = () => {
        if (questionData.type === 'multiple-choice') {
            setQuestionData(prev => ({
                ...prev,
                options: [...prev.options, '']
            }));
        } else {
            setQuestionData(prev => ({
                ...prev,
                answers: [...prev.answers, '']
            }));
        }
    };

    const handleTypeChange = (option) => {
        setQuestionData(prev => ({
            ...prev,
            type: option.value,
            answers: option.value === 'true-false' ? ['true'] : 
                    option.value === 'multiple-choice' ? [prev.options[0] || ''] : [''],
            options: option.value === 'multiple-choice' ? [''] : []
        }));
    };

    const handleSave = () => {
        onSave(questionData);
        onClose();
    };

    const setCorrectAnswer = (index) => {
        setQuestionData(prev => ({
            ...prev,
            answers: [prev.options[index]]
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">Edit Question</h3>
                    </div>
                    
                    <div className="form-group">
                        <label>Question *</label>
                        <input
                            type="text"
                            className="question-input"
                            value={questionData.question}
                            onChange={(e) => setQuestionData(prev => ({ ...prev, question: e.target.value }))}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Question Type *</label>
                            <CustomDropdown
                                options={questionTypes}
                                selectedValue={questionData.type}
                                onOptionSelect={handleTypeChange}
                                heightDropdown={40}
                                placeholder="Select question type"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Set Points *</label>
                            <input
                                type="text"
                                className="points-input"
                                value={questionData.points}
                                onChange={(e) => setQuestionData(prev => ({ ...prev, points: e.target.value }))}
                            />
                        </div>
                    </div>

                    {questionData.type === 'identification' ? (
                        <div className="form-group">
                            {questionData.answers.map((answer, index) => (
                                <div key={index} className="answer-input-container">
                                    <input
                                        type="text"
                                        className="answer-input"
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    />
                                    <button 
                                        className="remove-answer-btn"
                                        onClick={() => removeOption(index)}
                                    >
                                        <IoClose />
                                    </button>
                                </div>
                            ))}
                            <button className="add-answer-btn" onClick={addOption}>
                                <IoMdAdd />
                                Add a correct answer
                            </button>
                        </div>
                    ) : questionData.type === 'true-false' ? (
                        <div className="true-false-options">
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="tfAnswer"
                                    checked={questionData.answers[0] === 'true'}
                                    onChange={() => handleAnswerChange(0, 'true')}
                                />
                                <BsCheck2Circle className="radio-icon" />
                                <span>True</span>
                            </label>
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="tfAnswer"
                                    checked={questionData.answers[0] === 'false'}
                                    onChange={() => handleAnswerChange(0, 'false')}
                                />
                                <BsXCircle className="radio-icon" />
                                <span>False</span>
                            </label>
                        </div>
                    ) : (
                        <div className="multiple-choice-options">
                            {questionData.options.map((option, index) => (
                                <div key={index} className="multiple-choice-option">
                                    <label className="radio-option">
                                        <input 
                                            type="radio" 
                                            name="mcAnswer"
                                            checked={questionData.answers[0] === option}
                                            onChange={() => setCorrectAnswer(index)}
                                        />
                                        <RiRadioButtonFill className="radio-icon" />
                                        <input
                                            type="text"
                                            className="option-input"
                                            value={option}
                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            placeholder="Enter option"
                                        />
                                    </label>
                                    <button 
                                        className="remove-answer-btn"
                                        onClick={() => removeOption(index)}
                                    >
                                        <IoClose />
                                    </button>
                                </div>
                            ))}
                            <button className="add-answer-btn" onClick={addOption}>
                                <IoMdAdd />
                                Add an option
                            </button>
                        </div>
                    )}

                    <div className="modal-footer">
                        <ButtonGroup
                            onSave={handleSave}
                            onCancel={onClose}
                            saveText="Save"
                            saveButtonColor="#70B6A5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};