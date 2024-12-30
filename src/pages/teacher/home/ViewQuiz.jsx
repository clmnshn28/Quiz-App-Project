import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'assets/css/student';

export const ViewQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
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
    }, [classId]);

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
                 <div className="loading-spinner"></div>
            </div>
        );
    }


    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, quiz.questions.length);
    const currentQuestions = quiz.questions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(quiz.questions.length / questionsPerPage);
    
    return (
        <>
            <nav className="QuizzesTeacher__breadcrumb">
                <a href="/student/home" className="QuizzesTeacher__breadcrumb-nav">
                    <span>Home</span>
                </a>
                <span> &gt; </span>
                <a href={`/student/home/class/${classData?.id}`} className="QuizzesTeacher__breadcrumb-nav">
                    <span>{classData?.name || 'Loading...'}</span>
                </a>
                <span> &gt; </span>
                <span>{quiz?.title || 'Loading...'}</span>
            </nav>  

            <div className='TakeQuiz__box-shadow'>
                <div className="TakeQuiz__quiz-header">
                    <div className="TakeQuiz__title-section">
                        <h1 className="TakeQuiz__section-header">{quiz?.title || 'Quiz Title'}</h1>
                        <p className="TakeQuiz__quiz-subtitle">Read each question carefully before answering.</p>
                    </div>
                </div>


                <div className="TakeQuiz__quiz-main-take">
                {currentQuestions.map((questionData, index) => (
                        <div key={questionData.id} className={`TakeQuiz__question-container ${
                            index === currentQuestions.length - 1 ? 'last' : ''
                        }`}>
                            <p className="TakeQuiz__question-text">
                                {startIndex + index + 1}. {questionData.question_text}
                            </p>

                            {questionData.question_type === 'MC' && (
                                <div className="TakeQuiz__multi-options-container">
                                    {['option_a', 'option_b', 'option_c', 'option_d'].map((option, optionIndex) => (
                                        questionData[option] && (
                                            <label key={option} className="TakeQuiz__option-label">
                                                <input
                                                    type="radio"
                                                    name={`question-${questionData.id}`}
                                                    value={optionIndex}
                                                    disabled
                                                />
                                                <span className="TakeQuiz__option-text">{questionData[option]}</span>
                                            </label>
                                        )
                                    ))}
                                </div>
                            )}

                            {questionData.question_type === 'TF' && (
                                <div className="options-container">
                                    {['True', 'False'].map((option) => (
                                        <label key={option} className="TakeQuiz__option-label">
                                            <input
                                                type="radio"
                                                name={`question-${questionData.id}`}
                                                value={option}
                                                disabled
                                            />
                                            <span className="TakeQuiz__option-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {questionData.question_type === 'ID' && (
                                <div className='TakeQuiz__input-short-container'>
                                    <input
                                        type="text"
                                        className="TakeQuiz__identification-input"
                                        placeholder="Identification answer..."
                                        disabled
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="TakeQuiz__quiz-navigation">
                        {currentPage > 0 && (
                            <button 
                                className="TakeQuiz__back-quiz-button"
                                onClick={goToPreviousPage}
                            >
                                Back
                            </button>
                        )}
                        {currentPage < totalPages - 1 && (
                            <button 
                                className="TakeQuiz__submit-quiz-button"
                                onClick={goToNextPage}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};