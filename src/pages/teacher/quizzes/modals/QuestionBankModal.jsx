import React, { useState } from 'react';
import Modal from 'components/Modal';
import ButtonGroup from 'components/ButtonGroup';
import { LuClipboardCheck } from 'react-icons/lu';
import 'assets/css/modals';

export const QuestionBankModal = ({
    isOpen,
    onClose,
    questions,
    selectedQuestions,
    onSelect
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || q.question_type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <Modal>
            <div className="QuestionBankModal__content">
                <h2 className="QuestionBankModal__header">Question Bank</h2>
                
                <div className="QuestionBankModal__filters">
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="QuestionBankModal__search"
                    />
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="QuestionBankModal__type-filter"
                    >
                        <option value="all">All Types</option>
                        <option value="MC">Multiple Choice</option>
                        <option value="TF">True/False</option>
                        <option value="ID">Identification</option>
                    </select>
                </div>

                <div className="QuestionBankModal__questions-list">
                    {filteredQuestions.map(question => (
                        <div key={question.id} className="QuestionBankModal__question-item">
                            <label className="QuestionBankModal__question-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.some(q => q.id === question.id)}
                                    onChange={() => onSelect(question)}
                                />
                                <div className="QuestionBankModal__question-details">
                                    <span className="QuestionBankModal__question-type">
                                        {question.question_type}
                                    </span>
                                    <p className="QuestionBankModal__question-text">
                                        {question.question_text}
                                    </p>
                                    <div className="QuestionBankModal__answer-key">
                                        <LuClipboardCheck />
                                        Answer: {question.correct_answer}
                                    </div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>

                <ButtonGroup
                    onCancel={onClose}
                    onSave={() => onClose()}
                    saveText="Done"
                />
            </div>
        </Modal>
    );
};