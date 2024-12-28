import React, { useState, useEffect } from "react";
import CustomDropdown from "components/CustomDropdown";
import { EditQuestionModal } from "./modals/EditQuestionModal";
import { AddQuestionModal } from "./modals/AddQuestionModal";
import { DeleteQuestionModal } from "./modals/DeleteQuestionModal";
import { IoSearch } from "react-icons/io5";

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

    if (loading) return <div className="question-bank-wrapper">Loading...</div>;

    return (
        <div className="question-bank-wrapper">
            <div className="question-bank-main-header">
                <div className="header-section">
                    <h2>Question Bank</h2>
                    <button className="add-new-btn" onClick={handleAddClick}>
                        Add New Question
                    </button>
                </div>
                
                <div className="filter-section">
                    <div className="type-filter">
                        <span className="filter-label">Question Type</span>
                        <CustomDropdown
                            options={questionTypeOptions}
                            selectedValue={filterType}
                            onOptionSelect={(option) => setFilterType(option.value)}
                            heightDropdown={35}
                            placeholder="Select question type"
                        />
                    </div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <IoSearch className="search-icon"/>
                    </div>
                </div>
            </div>

            <div className="question-bank-container">
                <div className="table-container">
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
                            {filteredQuestions.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.question_text}</td>
                                    <td>{item.question_type}</td>
                                    <td>{getDisplayAnswer(item)}</td>
                                    <td>{item.points}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => handleEditClick(item)}
                                            />
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDeleteClick(item)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
        </div>
    );
};