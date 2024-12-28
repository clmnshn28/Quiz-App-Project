import React, {useState, useEffect} from "react";
import 'assets/css/teacher';
import CustomDropdown from "components/CustomDropdown";
import { EditQuestionModal } from "./modals/EditQuestionModal";
import { DeleteQuestionModal } from "./modals/DeleteQuestionModal";

export const QuizBankTeacher = () => {
    const [questionType, setQuestionType] = useState("identification");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [deletingQuestion, setDeletingQuestion] = useState(null);
    
    const questionTypeOptions = [
        { value: "identification", title: "Identification" }
    ];

    const questions = [
        { question: "sinong pogi", answer: "nibba man" },
        { question: "What will the following code output? print(type(42))", answer: "<class 'int'>" },
        { question: "Which data type is immutable in Python?", answer: "Tuple" },
        { question: "What is the output of the following code? x = 5...", answer: "True" },
        { question: "Which of the following is not a valid Python variable...", answer: "2ndVar" },
        { question: "What will be the output of the following code? x =...", answer: "20" },
        { question: "How do you check the length of a string s?", answer: "len(s)" },
        { question: "Which of the following is used to import a library in...", answer: "import" },
        { question: "What will the following code output? print(\"Python\"[...", answer: "nohtyP" },
        { question: "What is the default value returned by a function in...", answer: "None" },
        { question: "Which of the following is not a Python data type?", answer: "stack" },
        { question: "What will this code output? x = 5 y = 2 print(x % y)", answer: "1" },
        { question: "How can you generate a random number in Python?", answer: "import random; random.random()" },
        { question: "What is the output of this code? print(2 ** 3)", answer: "8" },
        { question: "How do you create an empty dictionary in Python?", answer: "Both A and C" }
    ];

    const handleEditClick = (question) => {
        setEditingQuestion(question);
        setShowEditModal(true);
    };

    const handleDeleteClick = (question) => {
        setDeletingQuestion(question);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        // Handle the deletion logic here
        setShowDeleteModal(false);
        setDeletingQuestion(null);
    };

    return (
        <div className="question-bank-wrapper">
            <div className="question-bank-main-header">
                <div className="header-section">
                    <h2>Question Bank</h2>
                    <button className="add-new-btn">Add New Question</button>
                </div>
                
                <div className="filter-section">
                    <span className="filter-label">Question Type</span>
                    <CustomDropdown
                        options={questionTypeOptions}
                        selectedValue={questionType}
                        onOptionSelect={(option) => setQuestionType(option.value)}
                        heightDropdown={35}
                        placeholder="Select question type"
                    />
                </div>
            </div>
            <div className="question-bank-container">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Correct Answer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.question}</td>
                                    <td>{item.answer}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => handleEditClick(item)}></button>
                                            <button className="delete-btn" onClick={() => handleDeleteClick(item)}></button>
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
                    onClose={() => setShowEditModal(false)}
                    initialData={editingQuestion}
                />
            )}
            {showDeleteModal && (
                <DeleteQuestionModal
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};