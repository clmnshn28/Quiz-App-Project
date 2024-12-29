import React, { useState, useEffect } from "react";
import CustomDropdown from "components/CustomDropdown";
import { EditQuestionModal } from "./modals/EditQuestionModal";
import { AddQuestionModal } from "./modals/AddQuestionModal";
import { DeleteQuestionModal } from "./modals/DeleteQuestionModal";

import { IoSearch } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";

export const QuizBankTeacher = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [deletingQuestion, setDeletingQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedQuestions = filteredQuestions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);


    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/questions/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            } else {
                throw new Error('Failed to fetch questions');
            }
        } catch (error) {
            setError('Error fetching questions');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (question) => {
        setEditingQuestion(question);
        setShowEditModal(true);
    };

    const handleDeleteClick = (question) => {
        setDeletingQuestion(question);
        setShowDeleteModal(true);
    };

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleEditSave = async (formData) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`https://apiquizapp.pythonanywhere.com/api/questions/${editingQuestion.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                await fetchQuestions();
                setShowEditModal(false);
                setEditingQuestion(null);
            } else {
                throw new Error('Failed to update question');
            }
        } catch (error) {
            setError('Error updating question');
            console.error('Error:', error);
        }
    };

    const handleAddSave = async (formData) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/questions/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                await fetchQuestions();
                setShowAddModal(false);
            } else {
                throw new Error('Failed to add question');
            }
        } catch (error) {
            setError('Error adding question');
            console.error('Error:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`https://apiquizapp.pythonanywhere.com/api/questions/${deletingQuestion.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.ok) {
                await fetchQuestions();
                setShowDeleteModal(false);
                setDeletingQuestion(null);
            } else {
                throw new Error('Failed to delete question');
            }
        } catch (error) {
            setError('Error deleting question');
            console.error('Error:', error);
        }
    };

    const getDisplayAnswer = (question) => {
        switch (question.question_type) {
            case 'MC':
                const options = {
                    'A': question.option_a,
                    'B': question.option_b,
                    'C': question.option_c,
                    'D': question.option_d
                };
                return options[question.correct_answer] || question.correct_answer;
            case 'TF':
                return question.correct_answer === 'true' ? 'True' : 'False';
            default:
                return question.correct_answer;
        }
    };

    const getQuestionTypeDisplay = (type) => {
        switch (type) {
            case 'MC':
                return 'Multiple Choice';
            case 'ID':
                return 'Identification';
            case 'TF':
                return 'True/False';
            default:
                return type;
        }
    };
    
    return (
        <>
            <div className="QuizBankTeacher__header-section">
                <h1 className="QuizBankTeacher__header">Question Bank</h1>
                <button className="QuizBankTeacher__add-new-btn" onClick={handleAddClick}>
                    Add New Question
                </button>
            </div>
            
            <div className="QuizBankTeacher__filter-section">
                <div className="QuizBankTeacher__search-container">
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="QuizBankTeacher__search-input"
                    />
                    <IoSearch className="QuizBankTeacher__search-icon"/>
                </div>
                <div className="QuizBankTeacher__type-filter">
                    {/* <span className="QuizBankTeacher__filter-label">Question Type</span> */}
                    <CustomDropdown
                        options={questionTypeOptions}
                        selectedValue={filterType}
                        onOptionSelect={(option) => setFilterType(option.value)}
                        heightDropdown='40'
                        placeholder="Select question type"
                    />
                </div>
            </div>
      
            <div className="QuizBankTeacher__table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Type</th>
                            <th>Correct Answer</th>
                            <th>Points</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedQuestions.map((item) => (
                            <tr key={item.id}>
                                <td>{item.question_text}</td>
                                <td>{getQuestionTypeDisplay(item.question_type)}</td>
                                <td>{getDisplayAnswer(item)}</td>
                                <td>{item.points}</td>
                                <td>
                                    <div className="QuizBankTeacher__action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEditClick(item)}
                                        >
                                        <MdOutlineEdit className="QuizBankTeacher__edit-btn-icon"/>
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteClick(item)}
                                        >
                                        <FiTrash2 className="QuizBankTeacher__trash-btn-icon"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredQuestions.length > itemsPerPage && (
                    <div className="QuizBankTeacher__pagination">
                        <button 
                            className="pagination-arrow" 
                            disabled={currentPage === 1} 
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <IoIosArrowRoundBack  className="pagination-arrow-icon"/>
                        </button>
                        <span className="pagination-number">
                            {currentPage} of {totalPages}
                        </span>
                        <button 
                            className="pagination-arrow" 
                            disabled={currentPage === totalPages} 
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                        <IoIosArrowRoundForward className="pagination-arrow-icon"/>
                        </button>
                    </div>
                    )}
            </div>
            
            {showEditModal && (
                <EditQuestionModal
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingQuestion(null);
                    }}
                    onSave={handleEditSave}
                    initialData={editingQuestion}
                />
            )}
            
            {showAddModal && (
                <AddQuestionModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddSave}
                />
            )}
            
            {showDeleteModal && (
                <DeleteQuestionModal
                    onClose={() => {
                        setShowDeleteModal(false);
                        setDeletingQuestion(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                />
            )}

            {error && <div className="error-message">{error}</div>}
        </>
    );
};