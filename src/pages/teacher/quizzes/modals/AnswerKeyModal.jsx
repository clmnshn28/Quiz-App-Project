import React, {useState, useEffect} from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from 'components/ButtonGroup';

import { IoIosCheckmarkCircleOutline, IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

export const AnswerKeyModal = ({
    isOpen,
    onClose,
    onConfirm,
    questionType,
    questionText,
    choices,
    correctAnswers,
    identificationAnswers,
    selectedTrueFalseAnswer,
    markOthersIncorrect: initialMarkOthersIncorrect,
}) =>{

    const [localCorrectAnswers, setLocalCorrectAnswers] = useState([]);
    const [localIdentificationAnswers, setLocalIdentificationAnswers] = useState([""]);
    const [localTrueFalseAnswer, setLocalTrueFalseAnswer] = useState(null);
    const [markOthersIncorrect, setMarkOthersIncorrect] = useState(false);

    useEffect(() => {
        if (questionType === "multipleChoice") {
            setLocalCorrectAnswers(correctAnswers);
        } else if (questionType === "identification") {
            setLocalIdentificationAnswers(identificationAnswers);
            setMarkOthersIncorrect(initialMarkOthersIncorrect); 
        } else if (questionType === "trueFalse") {
            setLocalTrueFalseAnswer(selectedTrueFalseAnswer);
        }
    }, [questionType, correctAnswers, identificationAnswers, selectedTrueFalseAnswer, initialMarkOthersIncorrect]);




    const handleCancelAnswerKey = () =>{
        if (questionType === "multipleChoice") {
            setLocalCorrectAnswers(correctAnswers);
        } else if (questionType === "identification") {
            setLocalIdentificationAnswers(identificationAnswers);
            setMarkOthersIncorrect(initialMarkOthersIncorrect);
        } else if (questionType === "trueFalse") {
            setLocalTrueFalseAnswer(selectedTrueFalseAnswer);
        }
        onClose();
        
    };

    const handleConfirmAnswerKey = () => {
        let answers;
        if (questionType === "multipleChoice") {
            answers = localCorrectAnswers;
            onConfirm(answers);
        } else if (questionType === "identification") {
            answers = localIdentificationAnswers;
            onConfirm(answers, markOthersIncorrect);  // Pass checkbox state
        } else if (questionType === "trueFalse") {
            answers = localTrueFalseAnswer;
            onConfirm(answers);
        }
    };

    const handleAddIdentificationAnswer = () => {
        setLocalIdentificationAnswers([...localIdentificationAnswers, ""]);
    };

    const handleIdentificationAnswerChange = (value, index) => {
        const updated = [...localIdentificationAnswers];
        updated[index] = value;
        setLocalIdentificationAnswers(updated);
    };

    const handleDeleteIdentificationAnswer = (index) => {
        setLocalIdentificationAnswers(
            localIdentificationAnswers.filter((_, idx) => idx !== index)
        );
    };

    const handleCheckboxChange = (e) => {
        console.log("Checkbox clicked", e.target.checked); 
        setMarkOthersIncorrect(e.target.checked);
    };
     
  if (!isOpen) return null;

    return(
        <Modal>
            <div className="AnswerKeyModal__content">
                <h2 className="AnswerKeyModal__header">Choose the correct answer:</h2>
                
                <div className="AnswerKeyModal__answer-key-content">
                    <h3 className="AnswerKeyModal__answer-key-header">{questionText || "This is the question"}</h3>
                    
                    {/* Style for multiple choice */}
                    {questionType === "multipleChoice" && (
                        <div className="AnswerKeyModal__answer-key-choice">
                            {choices.map((choice, index) => (
                                <label key={index} className="QuizzesTeacher__choice-label">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        className="QuizzesTeacher__choice-radio"
                                        checked={localCorrectAnswers.includes(index)}
                                        onChange={() => setLocalCorrectAnswers([index])}
                                    />
                                    <span>{choice}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    
                    {/* Style for identification */}
                    {questionType === "identification" && (
                        <div className="AnswerKeyModal__answer-key-identify">
                            {localIdentificationAnswers.map((answer, index) => (
                                <div key={index} className="QuizzesTeacher__choice-item">
                                    <input
                                        type="text"
                                        className="AnswerKeyModal__answer-input"
                                        value={answer}
                                        onChange={(e) => handleIdentificationAnswerChange(e.target.value, index)}
                                    />
                                    <button
                                        className="QuizzesTeacher__delete-choice"
                                        onClick={() => handleDeleteIdentificationAnswer(index)}
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                            <button
                                className="QuizzesTeacher__add-choice"
                                onClick={handleAddIdentificationAnswer}
                            >
                                <IoIosAddCircleOutline className="QuizzesTeacher__add-choice-icon"/>
                                Add a correct answer
                            </button>
                        </div>
                    )}

                    {/* Style for identification */}
                    {questionType === "trueFalse" && (
                        <div className="AnswerKeyModal__answer-key-container">
                            <div 
                                className={`AnswerKeyModal__answer-true-container ${localTrueFalseAnswer === true ? 'selected' : ''}`}
                                onClick={() => setLocalTrueFalseAnswer(true)}
                                
                            >
                                <IoIosCheckmarkCircleOutline className="QuizzesTeacher__true-icon"/> 
                                True
                            </div>  
                            <div 
                                className={`AnswerKeyModal__answer-false-container ${localTrueFalseAnswer === false ? 'selected' : ''}`}
                                onClick={() => setLocalTrueFalseAnswer(false)}
        
                            >
                                <IoIosCloseCircleOutline className="QuizzesTeacher__false-icon"/> 
                                False
                            </div>  
                        </div>
                    )}
                
                </div>

                <div className="AnswerKeyModal__btn-actions">
                    <div className="AnswerKeyModal__checkbox-container">
                        {questionType === "identification" && (
                            <label className="AnswerKeyModal__incorrect-checkbox">
                                <input
                                    type="checkbox"
                                    className="AnswerKeyModal__checkbox-input"
                                    checked={markOthersIncorrect}
                                    onChange={handleCheckboxChange}
                                />
                                Mark all other answer as incorrect
                            </label>
                        )}
                    </div>
                    <ButtonGroup
                        onCancel={handleCancelAnswerKey}
                        onSave={handleConfirmAnswerKey}
                        saveText='Done'
                        saveButtonColor='#67A292'
                    />
                </div>
            </div>
        </Modal>
    )
}