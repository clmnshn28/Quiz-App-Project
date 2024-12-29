import React, { useState, useEffect } from 'react';
import { IoMdRadioButtonOn, IoIosCheckmarkCircleOutline,IoIosCloseCircleOutline} from "react-icons/io";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { BsCheck2Circle, BsXCircle, BsRecordCircle } from "react-icons/bs";
import { RiRadioButtonFill } from "react-icons/ri";
import CustomDropdown from 'components/CustomDropdown';
import ButtonGroup from 'components/ButtonGroup';
import Modal from "components/Modal";
import "assets/css/modals/EditQuestionModal.css";

export const EditQuestionModal = ({ onClose, onSave, initialData = {} }) => {
    const [questionData, setQuestionData] = useState({
        question_text: initialData.question_text || '',
        question_type: initialData.question_type || 'ID',
        points: initialData.points || '1',
        correct_answer: initialData.correct_answer || '',
        option_a: initialData.option_a || '',
        option_b: initialData.option_b || '',
        option_c: initialData.option_c || '',
        option_d: initialData.option_d || ''
    });

    // Initialize selectedAnswer based on the question type
    const getInitialSelectedAnswer = () => {
        if (initialData.question_type === 'MC') {
            // Find which option matches the correct_answer
            const options = {
                'A': initialData.option_a,
                'B': initialData.option_b,
                'C': initialData.option_c,
                'D': initialData.option_d
            };
            
            // Find the letter whose option matches the correct_answer
            const letter = Object.entries(options).find(
                ([key, value]) => value === initialData.correct_answer
            );
            return letter ? letter[0] : '';
        }
        return initialData.correct_answer || '';
    };

    const [errors, setErrors] = useState({
        question_text: false,
        points: false,
        correct_answer: false,
        multiple_choice: false
    });

    const [selectedAnswer, setSelectedAnswer] = useState(getInitialSelectedAnswer());

    useEffect(() => {
        // Update selected answer when initialData changes
        setSelectedAnswer(getInitialSelectedAnswer());
    }, [initialData]);

    const questionTypes = [
        { 
            value: 'ID', 
            title: 'Identification',
            icon: <HiOutlineBars3BottomLeft />
        },
        { 
            value: 'TF', 
            title: 'True or False',
            icon: <IoIosCheckmarkCircleOutline/>
        },
        {
            value: 'MC',
            title: 'Multiple Choice',
            icon: <IoMdRadioButtonOn />
        }
    ];

    const handleOptionChange = (option, value) => {
        
        if (option === 'points') {
            // Convert to number and ensure it's positive
            const numValue = Math.max(0, parseInt(value) || 0);
            setQuestionData(prev => ({
                ...prev,
                [option]: numValue
            }));

            return;
        }
        
        setQuestionData(prev => ({
            ...prev,
            [option]: value
        }));

        // clear error when user types
        setErrors(prev => ({
            ...prev,
            [option]: false
        }));

        // If changing an MC option that was the correct answer, update correct_answer
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
        const defaultAnswer = newType === 'TF' ? 'True' : '';
        
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

        // clear errors on type change
        setErrors({
            question_text: false,
            points: false,
            correct_answer: false,
            multiple_choice: false
        });
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        
        // For MC, set the correct_answer to the selected option's text
        if (questionData.question_type === 'MC') {
            const optionKey = `option_${answer.toLowerCase()}`;
            setQuestionData(prev => ({
                ...prev,
                correct_answer: prev[optionKey]
            }));
        } else {
            handleOptionChange('correct_answer', answer);
        }

        // clear multiple choice error when answer is selected
        setErrors(prev => ({
            ...prev,
            multiple_choice: false
        }));
    };

    const validateForm = () => {
        const newErrors = {
            question_text: !questionData.question_text.trim(),
            points: !questionData.points || isNaN(questionData.points) || Number(questionData.points) <= 0,
            correct_answer: questionData.question_type === 'ID' && !questionData.correct_answer.trim(),
            multiple_choice: questionData.question_type === 'MC' && (
                !questionData.option_a.trim() || 
                !questionData.option_b.trim() || 
                !questionData.option_c.trim() || 
                !questionData.option_d.trim() ||
                !selectedAnswer
            )
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSave = () => {

        if (!validateForm()) {
            return;
        }

        // Create a copy of the question data for saving
        const saveData = { ...questionData };
        
        // For MC questions, ensure correct_answer is the option text
        if (saveData.question_type === 'MC' && selectedAnswer) {
            saveData.correct_answer = saveData[`option_${selectedAnswer.toLowerCase()}`];
        }
        
        onSave(saveData);
    };

    return (
        <Modal>
            <div className="AddQuestionModal__container"> 
                <h3 className="AddQuestionModal__header-title">Edit Question</h3>
                <div className="form-group">
                    <label className="AddQuestionModal__label">
                        Question
                        <span className="QuizzesTeacher__ques-main-required">*</span>
                    </label>
                    <input
                        type="text"
                        className="AddQuestionModal__input"
                        value={questionData.question_text}
                        onChange={(e) => handleOptionChange('question_text', e.target.value)}
                        placeholder="Enter your question"
                    />
                    {errors.question_text && (
                        <span className="QuizzesTeacher__error-question-text">
                            Question is required
                        </span>
                    )}
                </div>

                <div className="AddQuestionModal__type-point-container">
                    <div className="AddQuestionModal__question-type-content">
                        <label className="AddQuestionModal__label">
                            Question Type
                            <span className="QuizzesTeacher__ques-main-required">*</span>
                        </label>
                        <CustomDropdown
                            options={questionTypes}
                            selectedValue={questionData.question_type}
                            onOptionSelect={handleTypeChange}
                            heightDropdown='45'
                            placeholder="Select question type"
                        />
                    </div>
                        
                    <div className="form-group">
                        <label className="AddQuestionModal__label">
                            Set Points
                            <span className="QuizzesTeacher__ques-main-required">*</span>
                        </label>
                        <input
                            type="text"
                            className="AddQuestionModal__input"
                            value={questionData.points}
                            onChange={(e) => handleOptionChange('points', e.target.value)}
                        />
                        {errors.points && (
                            <span className="QuizzesTeacher__error-question-text">
                                Points must be a valid number greater than 0
                            </span>
                        )}
                    </div>
                </div>

                <div className='AddQuestionModal__answer-label-container'>
                    <label className="AddQuestionModal__label">
                        Answer {questionData.question_type !== 'ID' && 
                        <span  className="AddQuestionModal__label-selected"> 
                            (Select the correct answer)
                        </span>}
                        <span className="QuizzesTeacher__ques-main-required">*</span>
                    </label>
                    {errors.correct_answer && (
                        <span className="QuizzesTeacher__error-question-text">
                            Answer is required
                        </span>
                    )}
                </div>

                {questionData.question_type === 'ID' ? (
                    <div className="form-group">
                        <div className="AddQuestionModal__answer-container" style={{ flex: 1 }}>
                            <IoIosCheckmarkCircleOutline 
                                className="AddQuestionModal__question-type-icon"
                            />
                            <input
                                type="text"
                                className="AddQuestionModal__answer-identification-input"
                                value={questionData.correct_answer}
                                onChange={(e) => handleOptionChange('correct_answer', e.target.value)}
                                placeholder="Enter the correct answer"
                            />
                        </div>
                    </div>
                ) : questionData.question_type === 'TF' ? (
                    <div className="AddQuestionModal__true-false-options">
                        <label className="AddQuestionModal__answer-container" style={{ 
                            backgroundColor: selectedAnswer === 'True' ? '#d4edda' : 'white',
                            border: '1px solid #E5E7EB'
                        }}>
                            <input 
                                type="radio" 
                                name="tfAnswer"
                                checked={selectedAnswer === 'True'}
                                onChange={() => handleAnswerSelect('True')}
                            />
                            <IoIosCheckmarkCircleOutline 
                                className="AddQuestionModal__question-type-icon"
                            />
                            <span>True</span>
                            {selectedAnswer === 'True' && (
                                <div className="AddQuestionModal__correct-indicator-container">
                                    <span className="AddQuestionModal__correct-indicator">
                                        Correct Answer
                                    </span>
                                </div>
                            )}
                        </label>
                        <label className="AddQuestionModal__answer-container" style={{ 
                            backgroundColor: selectedAnswer === 'False' ? '#f8d7da' : 'white',
                            border: '1px solid #E5E7EB'
                        }}>
                            <input 
                                type="radio" 
                                name="tfAnswer"
                                checked={selectedAnswer === 'False'}
                                onChange={() => handleAnswerSelect('False')}
                            />
                            <IoIosCloseCircleOutline 
                                className="AddQuestionModal__question-type-icon"
                                style={{color: '#A26768'}}
                            />
                            <span>False</span>
                            {selectedAnswer === 'False' && (
                                <div className="AddQuestionModal__correct-indicator-container">
                                    <span className="AddQuestionModal__correct-indicator">
                                        Correct Answer
                                    </span>
                                </div>
                            )}
                        </label>
                    </div>
                ) : (
                    <div className="multiple-choice-options">
                        {['A', 'B', 'C', 'D'].map((letter) => (
                            <div key={letter} className="AddQuestionModal__multiple-choice-option">
                                <label className="AddQuestionModal__answer-container" style={{ 
                                    backgroundColor: selectedAnswer === letter ? '#d4edda' : 'white',
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
                                        <span className="AddQuestionModal__correct-indicator">
                                            Correct Answer
                                        </span>
                                    )}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                <div className="AddQuestionModal__btn-action">
                    <ButtonGroup
                        onSave={handleSave}
                        onCancel={onClose}
                        saveText="Save"
                        saveButtonColor="#67A292"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditQuestionModal;