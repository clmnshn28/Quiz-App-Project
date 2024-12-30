import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'assets/css/student';

export const EnterClassStudent = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassAndQuizzes = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('accessToken');
                
                // Fetch class data
                const classResponse = await fetch(`https://apiquizapp.pythonanywhere.com/api/classes/${classId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (!classResponse.ok) {
                    throw new Error('Failed to fetch class data');
                }
                const classData = await classResponse.json();
                setClassData(classData);

                // Fetch quizzes specifically for this class
                const quizzesResponse = await fetch(`https://apiquizapp.pythonanywhere.com/api/quizzes/?class=${classId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!quizzesResponse.ok) {
                    throw new Error('Failed to fetch quizzes');
                }
                const quizzesData = await quizzesResponse.json();
                
                // Filter quizzes to only include ones associated with this class
                const classQuizzes = quizzesData.filter(quiz => 
                    quiz.classes.includes(parseInt(classId))
                );
                
                setQuizzes(classQuizzes);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchClassAndQuizzes();
    }, [classId]);

    const isQuizAvailable = (quiz) => {
        const now = new Date();
        const start = new Date(quiz.start_datetime);
        const end = new Date(quiz.end_datetime);
        return now >= start && now <= end;
    };

    const handleQuizClick = async (quiz) => {
        // First check if the quiz is available
        if (!isQuizAvailable(quiz)) {
            // You might want to show a message to the user here
            return;
        }
    
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            // Check if student has already attempted the quiz
            const attemptsResponse = await fetch(
                `https://apiquizapp.pythonanywhere.com/api/attempts/?quiz=${quiz.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
    
            if (!attemptsResponse.ok) {
                throw new Error('Failed to check quiz attempts');
            }
    
            const attempts = await attemptsResponse.json();
            
            // Make sure we're checking specifically for attempts on this quiz
            const quizAttempts = attempts.filter(attempt => attempt.quiz === quiz.id);
            
            if (quizAttempts && quizAttempts.length > 0) {
                // If there's an attempt for this specific quiz, navigate to results
                navigate(`quiz/${quiz.id}/results`);
            } else {
                // If no attempt exists for this quiz, navigate to take the quiz
                navigate(`quiz/${quiz.id}`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const getQuizStatusClass = (quiz) => {
        const now = new Date();
        const start = new Date(quiz.start_datetime);
        const end = new Date(quiz.end_datetime);

        if (now < start) {
            return 'quiz-item--upcoming';
        } else if (now > end) {
            return 'quiz-item--expired';
        } else {
            return 'quiz-item--available';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <span className="error-icon">⚠️</span>
                <span className="error-message">{error}</span>
            </div>
        );
    }

    return (
        <div className="student-class">
            <div className="student-class__content">
                {/* Breadcrumb Navigation */}
                <div className="student-class__breadcrumb">
                    <a href="/student/home" className="nav-item">
                        <span>Home</span>
                    </a>
                    <span className="separator">{'>'}</span>
                    <span>{classData?.name || 'Loading...'}</span>
                </div>

                {/* Quiz Section */}
                <div className="student-classcontent">
                    <h1 className="student-classtitle">Class Quizzes</h1>
                    
                    {/* Quiz List */}
                    <div className="student-class__quiz-list">
                        {quizzes.length > 0 ? (
                            quizzes.map((quiz) => (
                                <div 
                                    key={quiz.id}
                                    className={`quiz-item ${getQuizStatusClass(quiz)}`}
                                    onClick={() => handleQuizClick(quiz)}
                                >
                                    <div className="quiz-icon">
                                        <span className="icon">📝</span>
                                    </div>
                                    <div className="quiz-details">
                                        <h3>{quiz.title}</h3>
                                        <div className="quiz-info">
                                            {isQuizAvailable(quiz) ? (
                                            <div className="quiz-timing">
                                                <span className="quiz-status quiz-status--available">
                                                    Available now
                                                </span>
                                                <span className="quiz-due-date">
                                                    Due: {new Date(quiz.end_datetime).toLocaleString()}
                                                </span>
                                            </div>
                                            ) : (
                                                <div className="quiz-timing">
                                                    <span>
                                                        Starts: {new Date(quiz.start_datetime).toLocaleString()}
                                                    </span>
                                                    <span>
                                                        Ends: {new Date(quiz.end_datetime).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="quiz-duration">
                                                ⏱️ {quiz.time_limit_minutes} minutes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                No quizzes available for this class yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};