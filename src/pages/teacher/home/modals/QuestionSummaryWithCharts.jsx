import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QuestionSummaryWithCharts = ({ questionStats }) => {
  // Prepare data for success rate chart
  const successRateData = questionStats.map((stat, index) => ({
    question: `Q${index + 1}`,
    successRate: parseFloat(stat.correctPercentage),
    avgPoints: parseFloat(stat.averagePoints),
    maxPoints: stat.points
  }));

  return (
    <div className="QuizReportModal__chart-section">
      <h3 className="QuizReportModal__chart-title">Question Performance Analysis</h3>
      
      {/* Success Rate Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={successRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#a9d8cb" />
            <XAxis 
              dataKey="question" 
              tick={{ fontWeight: '600' }}
            />
            <YAxis 
              tick={{ fontWeight: '600' }}
              domain={[0, 100]}
            />
            <Tooltip 
              cursor={{ fill: '#e0e0e0' }}  
              contentStyle={{ 
                backgroundColor: '#a9d8cb',
                borderRadius: '10px',
                height: '70px',
                fontWeight: '600',
                color: '#56575B',
              }}
            />
            <Bar dataKey="successRate" fill="#67A292" name="Success Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Points Distribution Chart */}
      <div className="chart-wrapper" style={{ marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={successRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#a9d8cb" />
            <XAxis 
              dataKey="question" 
              tick={{ fontWeight: '600' }}
            />
            <YAxis 
              tick={{ fontWeight: '600' }}
            />
            <Tooltip 
              cursor={{ fill: '#e0e0e0' }}  
              contentStyle={{ 
                backgroundColor: '#a9d8cb',
                borderRadius: '10px',
                height: '110px',
                fontWeight: '600',
                color: '#56575B',
              }}
            />
            <Bar dataKey="avgPoints" fill="#67A292" name="Average Points" />
            <Bar dataKey="maxPoints" fill="#67A292" name="Maximum Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Question Stats Table */}
      <div className="QuizReportModal__question-table" style={{ marginTop: '20px' }}>
        <table>
          <thead>
            <tr>
              <th style={{fontSize:'15px', padding:'15px 0 15px 35px', width:'20%'}}>Question #</th>
              <th style={{fontSize:'15px', padding:'15px',textAlign: 'center'}}>Correct Answers</th>
              <th style={{fontSize:'15px', padding:'15px', textAlign: 'center'}}>Success Rate</th>
              <th style={{fontSize:'15px', padding:'15px', width:'20%', textAlign: 'center'}}>Avg Points</th>
              <th style={{fontSize:'15px', padding:'15px', textAlign: 'center' }}>Max Points</th>
            </tr>
          </thead>
          <tbody>
            {questionStats.map((stat, index) => (
              <tr key={stat.questionId}>
                <td style={{ width:'20%'}}>Question {index + 1}</td>
                <td style={{ textAlign: 'center'}}>{stat.correctAttempts}/{stat.totalAttempts}</td>
                <td style={{textAlign: 'center'}}>{stat.correctPercentage}%</td>
                <td style={{ width:'20%',textAlign: 'center'}}>{stat.averagePoints}</td>
                <td style={{ textAlign: 'center'}}>{stat.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionSummaryWithCharts;