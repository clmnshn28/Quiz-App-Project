import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../../assets/css/student/QuizResult.css';

const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const XIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

export const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [classData, setClassData] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { quizId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                
                // Fetch quiz data first
                const quizResponse = await fetch(
                    `https://apiquizapp.pythonanywhere.com/api/quizzes/${quizId}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );

                if (!quizResponse.ok) {
                    throw new Error('Failed to fetch quiz data');
                }

                const quizData = await quizResponse.json();
                setQuiz(quizData);

                // Fetch class data if we have quiz data
                if (quizData.classes && quizData.classes.length > 0) {
                    const classResponse = await fetch(
                        `https://apiquizapp.pythonanywhere.com/api/classes/${quizData.classes[0]}/`,
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }
                    );
                    
                    if (!classResponse.ok) {
                        throw new Error('Failed to fetch class data');
                    }
                    const classData = await classResponse.json();
                    setClassData(classData);
                }

                // Set results from location state or fetch them
                if (location.state?.results) {
                    setResults(location.state.results);
                } else {
                    const resultsResponse = await fetch(
                        `https://apiquizapp.pythonanywhere.com/api/attempts/?quiz=${quizId}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }
                    );

                    if (!resultsResponse.ok) {
                        throw new Error('Failed to fetch quiz results');
                    }

                    const data = await resultsResponse.json();
                    if (data.length > 0) {
                        setResults(data[0]);
                    } else {
                        throw new Error('No quiz attempt found. Please take the quiz first.');
                    }
                }
            } catch (err) {
                setError(err.message);
                if (err.message.includes('No quiz attempt found')) {
                    navigate(-1);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [quizId, location.state, navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="no-results">
                <p>{error}</p>
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    Back to Quiz
                </button>
            </div>
        );
    }

    // Additional check to ensure results exist before rendering
    if (!results || !results.results) {
        return (
            <div className="no-results">
                <p>No results available for this quiz</p>
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    Back to Quiz
                </button>
            </div>
        );
    }

    const handleDone = () => {
        navigate(-2);
    };

    return (
        <div className="quiz-result-container">
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
                    <h1>{quiz?.title || 'Quiz Results'}</h1>
                    <p className="quiz-subtitle">Quiz Results</p>
                </div>
            </div>

            <div className="result-summary">
                <div className="score-circle">
                    <div className="score-value">{results?.score.toFixed(1)}%</div>
                    <div className="score-label">Score</div>
                </div>
                
                <div className="stats-container">
                    <div className="stat-item">
                        <span className="stat-label">Questions:</span>
                        <span className="stat-value">
                            {results?.correct_questions} / {results?.total_questions} correct
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Points:</span>
                        <span className="stat-value">
                            {results?.total_points} / {results?.max_points} points
                        </span>
                    </div>
                </div>
            </div>

            {/* Only show detailed results if show_correct_answers is true */}
            {results?.show_correct_answers && (
                <div className="results-detail">
                    {results.results && results.results.map((result, index) => (
                        <div key={index} className={`question-result ${result.correct ? 'correct' : 'incorrect'}`}>
                            <div className="result-header">
                                <div className="question-number">Question {index + 1}</div>
                                <div className="result-icon">
                                    {result.correct ? <CheckIcon /> : <XIcon />}
                                </div>
                            </div>
                            <div className="answer-details">
                                <div className="answer-row">
                                    <span className="answer-label">Your answer:</span>
                                    <span className="answer-value">{result.user_answer}</span>
                                </div>
                                <div className="answer-row">
                                    <span className="answer-label">Correct answer:</span>
                                    <span className="answer-value">{result.correct_answer}</span>
                                </div>
                                <div className="points-row">
                                    <span className="points-label">Points:</span>
                                    <span className="points-value">{result.points} / {result.max_points}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="quiz-navigation">
                <button onClick={() => navigate(-2)} className="done-button">
                    Done
                </button>
            </div>
        </div>
    );
};