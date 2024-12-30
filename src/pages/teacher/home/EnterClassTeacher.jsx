import React, {useState, useEffect} from "react";
import 'assets/css/student';
import { useParams,useNavigate } from 'react-router-dom';

import { LuClipboardList } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSortAlphaUp } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { InviteStudentModal, DeleteQuizModal, RemoveStudentModal } from "./modals";
import { CiCircleRemove } from "react-icons/ci";

export const EnterClassTeacher = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    const [inviteStudentModal, setInviteStudentModal] = useState(false);
    const [activeTab, setActiveTab] = useState('quizzes');
    const [showDropdown, setShowDropdown] = useState({ show: false, quizId: null });
    const [deleteQuizModal, setDeleteQuizModal] = useState({ show: false, quizId: null, quizName: '' });
    const [removeStudentModal, setRemoveStudentModal] = useState({ 
        show: false, 
        studentId: null, 
        studentName: '' 
    });


    const [quizzes, setQuizzes] = useState([
        { id: 1, name: "Python Basics" },
        { id: 2, name: "UNKNOWN" }
    ]);

    // delete quiz
    const handleDeleteQuiz = (quizId) => {
        setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
        setDeleteQuizModal({ show: false, quizId: null, quizName: '' });
    };

    const handleViewQuizClick = async (quiz) => {
        navigate(`quiz/${quiz.id}`);
    }


    // STUDENT FXN
    const [students, setStudents] = useState([
        { id: 1, name: "Arreza, Vonn Samuel", avatar: null },
        { id: 2, name: "Basinillo, Mark David", avatar: null },
        { id: 3, name: "Canoza, Joshua", avatar: null },
        { id: 4, name: "Dela Torre, Andrea Joy", avatar: null },
        { id: 5, name: "Lopez, Adrian James", avatar: null },
        { id: 6, name: "Quizon, Celmin Shane", avatar: null },
        { id: 7, name: "Soriano, Francis Harvey", avatar: null },
        { id: 8, name: "Sunpongco, Angelo Domini", avatar: null },
        { id: 9, name: "Ulang, Isaac", avatar: null },
        { id: 10, name: "Zapanta, Neil Carlo", avatar: null }
    ]);

    const handleRemoveStudent = (studentId) => {
        setStudents(students.filter(student => student.id !== studentId));
        setRemoveStudentModal({ show: false, studentId: null, studentName: '' });
    };


    // DROPDOWN FXN
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown.show && !event.target.closest('.EnterClassTeacher__dots-wrapper')) {
                setShowDropdown({ show: false, quizId: null });
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown.show]);
    
    
    return(
        <>
            <nav className="QuizzesTeacher__breadcrumb">
                <span>Home</span>
                <span> &gt; </span>
                <span>Class</span>
            </nav>

            <div className="EnterClassTeacher__container">
                <div className="EnterClassTeacher__header-section">
                    <div>
                        <p className="EnterClassTeacher__sub-section">Section</p>
                        <h1 className="EnterClassTeacher__class-name">Class Name</h1>
                    </div>
                    {activeTab === 'quizzes' && (
                        <button className="EnterClassTeacher__create-quiz-btn" onClick={()=> navigate('/teacher/quizzes')}>Create a Quiz</button>
                    )}
                </div>

                <div className="EnterClassTeacher__tabs">
                    <button 
                        className={`EnterClassTeacher__tab ${activeTab === 'quizzes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('quizzes')}
                    >
                        Quizzes
                    </button>
                    <button 
                        className={`EnterClassTeacher__tab ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Students
                    </button>
                </div>

                <div className="EnterClassTeacher__main-content">
                    {activeTab === 'quizzes' && (
                        <div className="EnterClassTeacher__quiz-list">
                            {quizzes.map(quiz => (
                                <div  key={quiz.id} className="EnterClassTeacher__quiz-item"  onClick={() => handleViewQuizClick(quiz)}>
                                    <span className="EnterClassTeacher__quiz-icon-container">
                                        <LuClipboardList className="EnterClassTeacher__quiz-icon"/>
                                    </span>
                                    <span className="EnterClassTeacher__quiz-name">{quiz.name}</span>
                                    <div className="EnterClassTeacher__dots-wrapper">
                                        <BsThreeDotsVertical 
                                        className="EnterClassTeacher__3dots-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDropdown({ 
                                                show: !showDropdown.show || showDropdown.quizId !== quiz.id, 
                                                quizId: quiz.id 
                                            });
                                        }}
                                        />
                                        {showDropdown.show && showDropdown.quizId === quiz.id && (
                                                <div className="EnterClassTeacher__dropdown">
                                                    <button 
                                                        className="EnterClassTeacher__dropdown-item "
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowDropdown({ show: false, quizId: null });
                                                        }}
                                                    >
                                                        Generate Reports
                                                    </button>
                                                    <button 
                                                        className="EnterClassTeacher__dropdown-item"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteQuizModal({ 
                                                                show: true, 
                                                                quizId: quiz.id,
                                                                quizName: quiz.name 
                                                            });
                                                            setShowDropdown({ show: false, quizId: null });
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'students' && (
                        <div className="EnterClassTeacher__students-list">
                            <div className="EnterClassTeacher__students-header">
                        
                                <div className="EnterClassTeacher__students-flex">
                                    <span className="EnterClassTeacher__students-name">Students Name</span> 
                                    <FaSortAlphaUp className="EnterClassTeacher__students-sort"/>
                                </div>
                                
                                <div className="EnterClassTeacher__students-flexs">
                                    <span className="EnterClassTeacher__students-count">8 Students</span>
                                    <span className="EnterClassTeacher__students-add-container" onClick={()=> setInviteStudentModal(true)}>
                                        <IoPersonAddSharp className="EnterClassTeacher__students-add" />
                                    </span>
                                </div>
                            </div>

                            <div className="EnterClassTeacher__students-items">
                                {students.map((student, index) => (
                                    <div 
                                        key={student.id} 
                                        className={`EnterClassTeacher__student-item ${index % 2 === 0 ? 'even' : ''}`}
                                    >
                                        <div className="EnterClassTeacher__student-info">
                                            <div className="EnterClassTeacher__student-avatar">
                                                {student.avatar || student.name.charAt(0)}
                                            </div>
                                            <span className="EnterClassTeacher__student-name">
                                                {student.name}
                                            </span>
                                        </div>
                                        <CiCircleRemove 
                                            className="EnterClassTeacher__remove-student"
                                            onClick={() => setRemoveStudentModal({ 
                                                show: true, 
                                                studentId: student.id, 
                                                studentName: student.name 
                                            })}
                                        />
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <InviteStudentModal
                isOpen={inviteStudentModal}
                onClose={()=> setInviteStudentModal(false)}
            />

            <DeleteQuizModal 
                isOpen={deleteQuizModal.show}
                onClose={() => setDeleteQuizModal({ show: false, quizId: null, quizName: '' })}
                onConfirm={() => handleDeleteQuiz(deleteQuizModal.quizId)}
                quizName={deleteQuizModal.quizName}
            />

            <RemoveStudentModal
                isOpen={removeStudentModal.show}
                onClose={() => setRemoveStudentModal({ show: false, studentId: null, studentName: '' })}
                onConfirm={() => handleRemoveStudent(removeStudentModal.studentId)}
                studentName={removeStudentModal.studentName}
            />
        </>
    );
};