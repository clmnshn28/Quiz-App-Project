import React, { useState, useEffect, useRef } from 'react';
import Modal from "components/Modal";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaDownload } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import 'assets/css/modals';

export const QuizReportModal = ({ isOpen, onClose, quizId, quizTitle }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState(null);
    const reportRef = useRef();

    useEffect(() => {
        if (isOpen && quizId) {
            fetchReportData();
        }
    }, [isOpen, quizId]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`https://apiquizapp.pythonanywhere.com/api/attempts/?quiz=${quizId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch report data');
            }

            const attempts = await response.json();
            processReportData(attempts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const processReportData = (attempts) => {
        if (!attempts.length) {
            setReportData(null);
            return;
        }

        const scores = attempts.map(a => a.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        const distribution = {
            'A (90-100)': 0,
            'B (80-89)': 0,
            'C (70-79)': 0,
            'D (60-69)': 0,
            'F (0-59)': 0
        };

        attempts.forEach(attempt => {
            if (attempt.score >= 90) distribution['A (90-100)']++;
            else if (attempt.score >= 80) distribution['B (80-89)']++;
            else if (attempt.score >= 70) distribution['C (70-79)']++;
            else if (attempt.score >= 60) distribution['D (60-69)']++;
            else distribution['F (0-59)']++;
        });

        const distributionData = Object.entries(distribution).map(([grade, count]) => ({
            grade,
            count,
            percentage: (count / attempts.length) * 100
        }));

        const timeData = attempts
            .sort((a, b) => new Date(a.attempt_datetime) - new Date(b.attempt_datetime))
            .map(attempt => ({
                date: new Date(attempt.attempt_datetime).toLocaleDateString(),
                score: attempt.score
            }));

        setReportData({
            totalAttempts: attempts.length,
            averageScore: avgScore.toFixed(1),
            highestScore: maxScore.toFixed(1),
            lowestScore: minScore.toFixed(1),
            distribution: distributionData,
            timeData
        });
    };

    const handleDownloadPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: 1,
            filename: `${quizTitle.replace(/\s+/g, '-')}_report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: true
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Wait for charts to be fully rendered
        setTimeout(() => {
            html2pdf().set(opt).from(element).save();
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <Modal>
            <div className="QuizReportModal__content">
                <div className="QuizReportModal__header-container">
                    <div className="QuizReportModal__pdf-container">
                        <h2 className="QuizReportModal__title">Report: {quizTitle}</h2>
                        {reportData && (
                            <button 
                                className="QuizReportModal__download-button"
                                onClick={handleDownloadPDF}
                                title="Download PDF"
                            >
                                <FaDownload className="download-icon" /> Generate PDF
                            </button>
                        )}
                    </div>
                    <button className="QuizReportModal__close-button" onClick={onClose}>&times;</button>
                </div>

                <div ref={reportRef} className="QuizReportModal__main-content">
                    {loading ? (
                        <div className="QuizReportModal__loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading report data...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : !reportData ? (
                        <div className="no-data-message">No attempts recorded for this quiz yet.</div>
                    ) : (
                        <div className="QuizReportModal__report-container">
                            <div className="QuizReportModal__stats-grid">
                                <div className="QuizReportModal__stat-card">
                                    <div className="QuizReportModal__stat-label">Total Attempts</div>
                                    <div className="QuizReportModal__stat-value">{reportData.totalAttempts}</div>
                                </div>
                                <div className="QuizReportModal__stat-card">
                                    <div className="QuizReportModal__stat-label">Average Score</div>
                                    <div className="QuizReportModal__stat-value">{reportData.averageScore}%</div>
                                </div>
                                <div className="QuizReportModal__stat-card">
                                    <div className="QuizReportModal__stat-label">Highest Score</div>
                                    <div className="QuizReportModal__stat-value">{reportData.highestScore}%</div>
                                </div>
                                <div className="QuizReportModal__stat-card">
                                    <div className="QuizReportModal__stat-label">Lowest Score</div>
                                    <div className="QuizReportModal__stat-value">{reportData.lowestScore}%</div>
                                </div>
                            </div>

                            <div className="QuizReportModal__charts-container">
                                <div className="QuizReportModal__chart-section">
                                    <h3 className="QuizReportModal__chart-title">Score Distribution</h3>
                                    <div className="chart-wrapper">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={reportData.distribution} >
                                                <CartesianGrid strokeDasharray="3 3"  stroke="#a9d8cb" />
                                                <XAxis dataKey="grade" tick={{ fontWeight: '600'}}/>
                                                <YAxis  tick={{ fontWeight: '600'}}/>
                                                <Tooltip  
                                                cursor={{ fill: '#e0e0e0' }}  
                                                contentStyle={{ 
                                                    backgroundColor: '#a9d8cb',
                                                    borderRadius: '10px',
                                                    height: '70px',
                                                    fontWeight: '600',
                                                    color: '#56575B',
                                                }} />
                                                <Bar dataKey="count" fill="#67A292" 
                
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="QuizReportModal__chart-section">
                                    <h3 className="QuizReportModal__chart-title">Score Trends</h3>
                                    <div className="chart-wrapper">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={reportData.timeData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#a9d8cb"/>
                                                <XAxis dataKey="date"  tick={{ fontWeight: '600'}}/>
                                                <YAxis domain={[0, 100]}  tick={{ fontWeight: '600'}}/>
                                                <Tooltip 
                                                cursor={{ fill: '#e0e0e0' }}  
                                                contentStyle={{ 
                                                    backgroundColor: '#a9d8cb',
                                                    borderRadius: '10px',
                                                    height: '70px',
                                                    fontWeight: '600',
                                                    color: '#56575B',
                                                }} />
                                                <Line type="monotone" dataKey="score" stroke="#67A292" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};