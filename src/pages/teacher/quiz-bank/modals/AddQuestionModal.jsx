import React, { useState } from 'react';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { BsCheck2Circle, BsXCircle, BsRecordCircle } from "react-icons/bs";
import { RiRadioButtonFill } from "react-icons/ri";
import CustomDropdown from 'components/CustomDropdown';
import ButtonGroup from 'components/ButtonGroup';

export const AddQuestionModal = ({ onClose, onSave }) => {
    const [questionData, setQuestionData] = useState({
        question_text: '',
        question_type: 'ID',
        points: '1',
        correct_answer: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: ''
    });

    const [selectedAnswer, setSelectedAnswer] = useState('');

    const questionTypes = [
        { 
            value: 'ID', 
            title: 'Identification',
            icon: <HiOutlineMenuAlt2 className="question-type-icon" />
        },
        { 
            value: 'TF', 
            title: 'True or False',
            icon: <BsCheck2Circle className="question-type-icon" />
        },
        {
            value: 'MC',
            title: 'Multiple Choice',
            icon: <BsRecordCircle className="question-type-icon" />
        }
    ];

    const handleOptionChange = (option, value) => {
        setQuestionData(prev => ({
            ...prev,
            [option]: value
        }));

        if (questionData.question_type === 'MC' && 
            option.startsWith('option_') && 
            selectedAnswer === option.charAt(option.length - 1).toUpperCase()) {
            setQuestionData(prev => ({
                ...prev,
                correct_answer: value
            }));
        }
    };

    const handleTypeChange = (option) => {
        const newType = option.value;
        const defaultAnswer = newType === 'TF' ? 'true' : '';
        
        setQuestionData(prev => ({
            ...prev,
            question_type: newType,
            correct_answer: defaultAnswer,
            option_a: newType === 'MC' ? '' : null,
            option_b: newType === 'MC' ? '' : null,
            option_c: newType === 'MC' ? '' : null,
            option_d: newType === 'MC' ? '' : null
        }));
        setSelectedAnswer(defaultAnswer);
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        
        if (questionData.question_type === 'MC') {
            const optionKey = `option_${answer.toLowerCase()}`;
            setQuestionData(prev => ({
                ...prev,
                correct_answer: prev[optionKey]
            }));
        } else {
            handleOptionChange('correct_answer', answer);
        }
    };

    const handleSave = () => {
        const saveData = { ...questionData };
        
        if (saveData.question_type === 'MC' && selectedAnswer) {
            saveData.correct_answer = saveData[`option_${selectedAnswer.toLowerCase()}`];
        }
        
        onSave(saveData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">Add New Question</h3>
                    </div>
                    
                    <div className="form-group">
                        <label>Question *</label>
                        <input
                            type="text"
                            className="question-input"
                            value={questionData.question_text}
                            onChange={(e) => handleOptionChange('question_text', e.target.value)}
                            placeholder="Enter your question"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Question Type *</label>
                            <CustomDropdown
                                options={questionTypes}
                                selectedValue={questionData.question_type}
                                onOptionSelect={handleTypeChange}
                                heightDropdown={40}
                                placeholder="Select question type"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Set Points *</label>
                            <input
                                type="number"
                                min="1"
                                className="points-input"
                                value={questionData.points}
                                onChange={(e) => handleOptionChange('points', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Answer{questionData.question_type !== 'ID' && " (Select the correct answer)"} *</label>
                    </div>

                    {questionData.question_type === 'ID' ? (
                        <div className="form-group">
                            <div className="answer-input-container">
                                <div className="radio-option" style={{ flex: 1 }}>
                                    <BsCheck2Circle 
                                        className="radio-icon"
                                        style={{ color: '#70B6A5' }}
                                    />
                                    <input
                                        type="text"
                                        className="answer-input"
                                        value={questionData.correct_answer}
                                        onChange={(e) => handleOptionChange('correct_answer', e.target.value)}
                                        placeholder="Enter the correct answer"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : questionData.question_type === 'TF' ? (
                        <div className="true-false-options">
                            <label className="radio-option" style={{ 
                                backgroundColor: selectedAnswer === 'true' ? '#E8F1F0' : 'white',
                                border: '1px solid #E5E7EB'
                            }}>
                                <input 
                                    type="radio" 
                                    name="tfAnswer"
                                    checked={selectedAnswer === 'true'}
                                    onChange={() => handleAnswerSelect('true')}
                                />
                                <BsCheck2Circle className="radio-icon" />
                                <span>True</span>
                                {selectedAnswer === 'true' && (
                                    <span className="correct-indicator">
                                        Correct Answer
                                    </span>
                                )}
                            </label>
                            <label className="radio-option" style={{ 
                                backgroundColor: selectedAnswer === 'false' ? '#E8F1F0' : 'white',
                                border: '1px solid #E5E7EB'
                            }}>
                                <input 
                                    type="radio" 
                                    name="tfAnswer"
                                    checked={selectedAnswer === 'false'}
                                    onChange={() => handleAnswerSelect('false')}
                                />
                                <BsXCircle className="radio-icon" />
                                <span>False</span>
                                {selectedAnswer === 'false' && (
                                    <span className="correct-indicator">
                                        Correct Answer
                                    </span>
                                )}
                            </label>
                        </div>
                    ) : (
                        <div className="multiple-choice-options">
                            {['A', 'B', 'C', 'D'].map((letter) => (
                                <div key={letter} className="multiple-choice-option">
                                    <label className="radio-option" style={{ 
                                        backgroundColor: selectedAnswer === letter ? '#E8F1F0' : 'white',
                                        border: '1px solid #E5E7EB'
                                    }}>
                                        <input 
                                            type="radio" 
                                            name="mcAnswer"
                                            checked={selectedAnswer === letter}
                                            onChange={() => handleAnswerSelect(letter)}
                                        />
                                        <RiRadioButtonFill className="radio-icon" />
                                        <input
                                            type="text"
                                            className="option-input"
                                            value={questionData[`option_${letter.toLowerCase()}`] || ''}
                                            onChange={(e) => handleOptionChange(`option_${letter.toLowerCase()}`, e.target.value)}
                                            placeholder={`Option ${letter}`}
                                        />
                                        {selectedAnswer === letter && (
                                            <span className="correct-indicator">
                                                Correct Answer
                                            </span>
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="modal-footer">
                        <ButtonGroup
                            onSave={handleSave}
                            onCancel={onClose}
                            saveText="Add Question"
                            saveButtonColor="#70B6A5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionModal;