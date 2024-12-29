import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../assets/css/student/TakeQuiz.css';

export const TakeQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [classData, setClassData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 5;

    useEffect(() => {
        const fetchQuizAndClass = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const quizResponse = await fetch(`https://apiquizapp.pythonanywhere.com/api/quizzes/${quizId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!quizResponse.ok) {
                    throw new Error('Failed to fetch quiz');
                }

                const quizData = await quizResponse.json();
                if (!quizData.questions || quizData.questions.length === 0) {
                    throw new Error('No questions available for this quiz');
                }
                setQuiz(quizData);
                setTimeLeft(quizData.time_limit_minutes * 60);

                // Fetch class data using the first class ID from the quiz
                if (quizData.classes && quizData.classes.length > 0) {
                    const classResponse = await fetch(`https://apiquizapp.pythonanywhere.com/api/classes/${quizData.classes[0]}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    
                    if (!classResponse.ok) {
                        throw new Error('Failed to fetch class data');
                    }
                    const classData = await classResponse.json();
                    setClassData(classData);
                }
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchQuizAndClass();
    }, [quizId]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`https://apiquizapp.pythonanywhere.com/api/quizzes/${quizId}/take_quiz/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers })
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            const result = await response.json();
            navigate(`results`, { state: { results: result } });
        } catch (err) {
            setError(err.message);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const goToNextPage = () => {
        if (currentPage < Math.ceil(quiz.questions.length / questionsPerPage) - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="quiz-loading">
                <div className="quiz-loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-error">
                <p>{error}</p>
            </div>
        );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="quiz-error">
                <p>No questions available for this quiz</p>
            </div>
        );
    }

    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, quiz.questions.length);
    const currentQuestions = quiz.questions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(quiz.questions.length / questionsPerPage);

    return (
        <div className="quiz-container">
            <div className="student-class__breadcrumb">
                <a href="/student/home" className="nav-item">
                    <span>Home</span>
                </a>
                <span className="separator">{'>'}</span>
                <a href={`/student/class/${classData?.id}`} className="nav-item">
                    <span>{classData?.name || 'Loading...'}</span>
                </a>
                <span className="separator">{'>'}</span>
                <span>{quiz?.title || 'Loading...'}</span>
            </div>
            
            <div className="quiz-header">
                <div className="quiz-title-section">
                    <h1>{quiz.title}</h1>
                    <p className="quiz-subtitle">Read each question carefully before answering.</p>
                </div>
                <div className="quiz-timer">
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="questions-page-info">
                Page {currentPage + 1} of {totalPages}
            </div>

            {currentQuestions.map((questionData, index) => (
                <div key={questionData.id} className="question-container">
                    <p className="question-text">
                        {startIndex + index + 1}. {questionData.question_text}
                    </p>

                    {questionData.question_type === 'MC' && (
                        <div className="options-container">
                            {['option_a', 'option_b', 'option_c', 'option_d'].map((option, optionIndex) => (
                                questionData[option] && (
                                    <label key={option} className="option-label">
                                        <input
                                            type="radio"
                                            name={`question-${questionData.id}`}
                                            value={optionIndex}
                                            checked={answers[questionData.id] === optionIndex.toString()}
                                            onChange={(e) => handleAnswerChange(questionData.id, e.target.value)}
                                        />
                                        <span className="option-text">{questionData[option]}</span>
                                    </label>
                                )
                            ))}
                        </div>
                    )}

                    {questionData.question_type === 'TF' && (
                        <div className="options-container">
                            {['True', 'False'].map((option) => (
                                <label key={option} className="option-label">
                                    <input
                                        type="radio"
                                        name={`question-${questionData.id}`}
                                        value={option}
                                        checked={answers[questionData.id] === option}
                                        onChange={(e) => handleAnswerChange(questionData.id, e.target.value)}
                                    />
                                    <span className="option-text">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {questionData.question_type === 'ID' && (
                        <input
                            type="text"
                            className="identification-input"
                            value={answers[questionData.id] || ''}
                            onChange={(e) => handleAnswerChange(questionData.id, e.target.value)}
                            placeholder="Type your answer here..."
                        />
                    )}
                </div>
            ))}

            <div className="quiz-navigation">
                <button 
                    className="nav-button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 0}
                >
                    Previous Page
                </button>

                <button 
                    className="submit-button"
                    onClick={handleSubmit}
                >
                    Submit Quiz
                </button>

                <button 
                    className="nav-button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};