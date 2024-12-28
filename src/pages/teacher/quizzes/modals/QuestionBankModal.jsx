import React, { useState, useEffect } from 'react';
import 'assets/css/modals';
import Modal from 'components/Modal';
import ButtonGroup from 'components/ButtonGroup';
import CustomDropdown from 'components/CustomDropdown';
import { IoSearch } from "react-icons/io5";
import { LuClipboardCheck } from 'react-icons/lu';

export const QuestionBankModal = ({
    isOpen,
    onClose,
    questions,
    selectedQuestions,
    onSelect
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [tempSelected, setTempSelected] = useState([]);

    useEffect(() => {
        setTempSelected(selectedQuestions);
    }, [selectedQuestions]);

    const questionTypeOptions = [
        { value: 'all', title: 'All Types' },
        { value: 'MC', title: 'Multiple Choice' },
        { value: 'TF', title: 'True/False' },
        { value: 'ID', title: 'Identification' },
    ];


    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || q.question_type === filterType;
        return matchesSearch && matchesType;
    });

    const handleTempSelect = (question) => {
        setTempSelected(prev => 
            prev.some(q => q.id === question.id)
                ? prev.filter(q => q.id !== question.id)
                : [...prev, question]
        );
    };

    const handleDone = () => {
        // Find questions to add and remove
        tempSelected.forEach(question => {
            if (!selectedQuestions.some(q => q.id === question.id)) {
                onSelect(question); // Add new selections
            }
        });
        
        selectedQuestions.forEach(question => {
            if (!tempSelected.some(q => q.id === question.id)) {
                onSelect(question); // Remove deselected questions
            }
        });
        onClose();
    };

    const handleCancel = () => {
        setTempSelected(selectedQuestions);
        onClose();
    };

    if(!isOpen) return null; 

    return (
        <Modal>
            <div className="QuestionBankModal__content">
                <h2 className="QuestionBankModal__header">Question Bank</h2>
                
                <div className="QuestionBankModal__filters">
                    <div className="QuestionBankModal__input-container">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="QuestionBankModal__search"
                        />
                        <div className='QuestionBankModal__search-line'></div>
                        <IoSearch className="QuestionBankModal__search-icon"/>
                    </div>
                    <div className="QuestionBankModal__dropdown-container">
                        <CustomDropdown
                            options={questionTypeOptions}
                            selectedValue={filterType}
                            onOptionSelect={(option) => setFilterType(option.value)}
                            heightDropdown={40}
                            placeholder="Select Question Type"
                        />
                    </div>
                </div>

                <div className="QuestionBankModal__questions-list">
                    {questions.length === 0 ? (
                        <p className="QuestionBankModal__no-results">
                            No questions available in the question bank.
                        </p>
                    ):filteredQuestions.length > 0 ? (
                        filteredQuestions.map(question => (
                            <div key={question.id} className="QuestionBankModal__question-item">
                                <label className="QuestionBankModal__question-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={tempSelected.some(q => q.id === question.id)}
                                        onChange={() => handleTempSelect(question)}
                                    />
                                    <div className="QuestionBankModal__question-details">
                                        <span className="QuestionBankModal__question-type">
                                            {question.question_type}
                                        </span>
                                        <p className="QuestionBankModal__question-text">
                                            {question.question_text}
                                        </p>
                        
                                            <div className="QuestionBankModal__answer-key">
                                                <LuClipboardCheck className="QuestionBankModal__answer-key-icon"/>
                                                <span className="QuestionBankModal__answer">Answer:</span> {question.correct_answer}
                                            </div>
                                    </div>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="QuestionBankModal__no-results">
                            No questions found matching your search criteria.
                        </p>
                    )}
                </div>

                <ButtonGroup
                    onCancel={handleCancel}
                    onSave={handleDone}
                    saveText="Done"
                    saveButtonColor='#67A292'
                />
            </div>
        </Modal>
    );
};