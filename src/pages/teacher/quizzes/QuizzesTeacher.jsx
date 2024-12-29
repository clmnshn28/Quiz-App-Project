import React, {useState, useEffect, useRef } from "react";
import 'assets/css/teacher';
import CustomDropdown from "components/CustomDropdown";
import CustomDatePicker from 'components/CustomDatePicker';
import ScrollableTimePicker from 'components/ScrollableTimePicker';
import TimePicker from "../../../components/TimePicker";
import { LuClipboardCheck } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { IoMdRadioButtonOn, IoIosCheckmarkCircleOutline, IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

import { AnswerKeyModal, SuccessPublishModal, QuestionBankModal, QuizAnswerKeyPreview } from "./modals";

export const QuizzesTeacher = () => {
    const [combinedQuestions, setCombinedQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [questions, setQuestions] = useState([{
        id: 1,
        questionText: "",
        selectedOption: 'multipleChoice',
        choices: [""],
        points: 1, // Default points value
        correctAnswers: [],
        identificationAnswers: [""],
        selectedTrueFalseAnswer: null,
        markOthersIncorrect: false 
    }]);
    
    const options = [
        { value: "multipleChoice", title: "Multiple Choice", icon: <IoMdRadioButtonOn /> },
        { value: "identification", title: "Identification", icon: <HiOutlineBars3BottomLeft /> },
        { value: "trueFalse", title: "True/False", icon: <IoIosCheckmarkCircleOutline /> },
    ];

    const [isScrolled, setIsScrolled] = useState(false); 

    const [isAnswerKeyModal, setIsAnswerKeyModal] = useState(false); 
    const [currentQuestionId, setCurrentQuestionId] = useState(1);
    const [isSuccessPublishModal, setIsSuccessPublishModal] = useState(false); 
    const [isPreviewModal, setIsPreviewModal] = useState(false);
    const questionCardRef = useRef(null);

     const [errorStates, setErrorStates] = useState({
        answerKey: {},
        questionText: {},
        pointText: {},
        multipleFilled: {}
    });
     const handleOptionSelect = (option, questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    selectedOption: option.value,
                    correctAnswers: [],
                    identificationAnswers: [""],
                    selectedTrueFalseAnswer: null
                };
            }
            return q;
        }));
    };

     const handleAddChoice = (questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.choices.length < 4) {
                return {
                    ...q,
                    choices: [...q.choices, ""]
                };
            }
            return q;
        }));
    };

    const handleChoiceChange = (value, index, questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const updatedChoices = [...q.choices];
                updatedChoices[index] = value;
                return {
                    ...q,
                    choices: updatedChoices
                };
            }
            return q;
        }));
        
    };

    const handleDeleteChoice = (index, questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    choices: q.choices.filter((_, idx) => idx !== index)
                };
            }
            return q;
        }));
    };
    
    const handleAnswerKeyClick = (questionId) => {
        const question = questions.find(q => q.id === questionId);
        
        if (!isAnswerKeyEnabled(question)) {
            setErrorStates(prev => ({
                ...prev,
                answerKey: {
                    ...prev.answerKey,
                    [questionId]: true
                }
            }));
            return;
        }
        
        setCurrentQuestionId(questionId);
        setIsAnswerKeyModal(true);
    };

    // answer key confirm
   const handleAnswerKeyConfirm = (answers, markOthersIncorrect) => {  
    setQuestions(questions.map(q => {
        if (q.id === currentQuestionId) {
            if (q.selectedOption === "multipleChoice") {
                return { ...q, correctAnswers: answers };
            } else if (q.selectedOption === "identification") {
                return { 
                    ...q, 
                    identificationAnswers: answers,
                    markOthersIncorrect: markOthersIncorrect  
                };
            } else if (q.selectedOption === "trueFalse") {
                return { ...q, selectedTrueFalseAnswer: answers };
            }
        }
        return q;
    }));
    setIsAnswerKeyModal(false);
};

const handlePreviewAnswerKey = (questionId) => (e) => {  // Changed to return a function
    e.preventDefault();  // Prevent any default behavior
    const question = selectedBankQuestions.find(q => q.id === questionId);
    if (question) {
        setCurrentQuestionId(questionId);
        setIsPreviewModal(true);
    }
};

    const handleQuestionTextChange = (value, questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                return { ...q, questionText: value };
            }
            return q;
        }));
        setErrorStates(prev => ({
            ...prev,
            questionText: {
                ...prev.questionText,
                [questionId]: !value.trim()
            }
        }));
    };

    const handlePointsChange = (value, questionId) => {
        const isValidNumber = /^\d*$/.test(value);
    
        if (isValidNumber || value === '') {
            setQuestions(questions.map(q => {
                if (q.id === questionId) {
                    return { ...q, points: value };
                }
                return q;
            }));
        }
    
        setErrorStates(prev => ({
            ...prev,
            pointText: {
                ...prev.pointText,
                [questionId]: !value.trim() 
            }
        }));
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            questionText: "",
            selectedOption: "multipleChoice",
            choices: [""],
            points: "",
            correctAnswers: [],
            identificationAnswers: [""],
            selectedTrueFalseAnswer: null
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleDuplicateQuestion = (questionId) => {
        const questionToDuplicate = questions.find(q => q.id === questionId);
        const newQuestion = {
            ...questionToDuplicate,
            id: questions.length + 1
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleDeleteQuestion = (questionId) => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter(q => q.id !== questionId)
                .map((q, index) => ({
                    ...q,
                    id: index + 1
                }));
            setQuestions(updatedQuestions);
        }
    };

    const isAnswerKeyEnabled = (question) => {
        if (!question.questionText.trim()) {
            return false;
        }
        if (question.selectedOption === "multipleChoice") {
            return question.choices.every(choice => choice.trim() !== "");
        }
        return true;
    };
    
    // Detect scroll and update isScrolled state
    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 0) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    

    const handleNext = () => {
        const newErrorStates = {
            answerKey: {},
            questionText: {},
            pointText: {},
            multipleFilled: {}
        };
    
        let hasErrors = false;
    
        // Validate new questions
        questions.forEach(question => {
            if (!question.questionText?.trim()) {
                newErrorStates.questionText[question.id] = true;
                hasErrors = true;
            }
    
            // Points validation - handle as number
            const points = parseInt(question.points);
            if (isNaN(points) || points < 1) {
                newErrorStates.pointText[question.id] = true;
                hasErrors = true;
            }
    
            // Multiple choice validation
            if (question.selectedOption === 'multipleChoice' && 
                !question.choices.every(choice => choice.trim() !== "")) {
                newErrorStates.multipleFilled[question.id] = true;
                hasErrors = true;
            }
    
            // Answer key validation
            if (!question.correctAnswers?.length && 
                !question.identificationAnswers?.[0] && 
                question.selectedTrueFalseAnswer === null) {
                newErrorStates.answerKey[question.id] = true;
                hasErrors = true;
            }
        });
    
        setErrorStates(newErrorStates);
        
        // Validate bank questions
        if (selectedBankQuestions.length === 0 && questions.length === 0) {
            setQuestionsError(true);
            hasErrors = true;
        }
    
        if (hasErrors) {
            setErrorStates(newErrorStates);
            return;
        }
    
        // Combine questions for next step
        setCombinedQuestions([...selectedBankQuestions, ...questions]);
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

// Step 2 useStates
    // Class selection state
    const [classOptions, setClassOptions] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classError, setClassError] = useState(false);

    // Time and schedule state
    const [timeHours, setTimeHours] = useState('00');
    const [timeMinutes, setTimeMinutes] = useState('30');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState(''); // Default 5:00 PM
    const [endTime, setEndTime] = useState(''); // Default 11:59 PM
    const [scheduleError, setScheduleError] = useState(false);

    // Quiz details state
    const [quizName, setQuizName] = useState('');
    const [quizNameError, setQuizNameError] = useState(false);
    const [timerError, setTimerError] = useState(false);

    // Settings toggles
    const [toggleSettings, setToggleSettings] = useState({
        showAnswer: false,
        pointValues: false,
        missedQuestions: false,
        correctAnswers: false
    });

    // Fetch classes on component mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('https://apiquizapp.pythonanywhere.com/api/classes/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const formattedClasses = data.map(c => ({
                        value: c.id,
                        title: c.section ? `${c.name} ${c.section}` : c.name
                    }));
                    setClassOptions(formattedClasses);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);
    
    // Toggle
    const handleToggleChange = (setting) => {
        setToggleSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

   // quiz nameZZ
    const handleQuizNameChange = (e) => {
        setQuizName(e.target.value);
        if (e.target.value.trim()) {
            setQuizNameError(false);
        }
    };

    // time
    const handleTimeChange = (hours, minutes) => {
        setTimeHours(hours);
        setTimeMinutes(minutes);
        if (hours !== '00' || minutes !== '00') {
            setTimerError(false);
        }
    };

    // Date
    const combineDateAndTime = (date, time) => {
        if (!date || !time) return null;
        
        const [hours, minutes] = time.split(':').map(Number);
        const dateObj = new Date(date);
        dateObj.setHours(hours, minutes, 0, 0);
        
        return dateObj;
    };

    const handleStartTimeChange = (time) => {
        setStartTime(time);
        setScheduleError(false);
    };
    
    const handleEndTimeChange = (time) => {
        setEndTime(time);
        setScheduleError(false);
    };
    
    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date && endDate) setScheduleError(false);
    };
    
    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (startDate && date) setScheduleError(false);
    };

    // Add these state declarations at the top with other states
const [publishError, setPublishError] = useState(false);
const [questionsError, setQuestionsError] = useState(false);

// Add reset form function
const resetForm = () => {
    setQuizName('');
    setSelectedClass(null);
    setQuestions([]);
    setStartDate('');
    setEndDate('');
    setTimeHours('00');
    setTimeMinutes('00');
    setToggleSettings({
        showAnswer: false,
        pointValues: false,
        missedQuestions: false,
        correctAnswers: false
    });
    clearErrors();
};

const clearErrors = () => {
    setQuizNameError(false);
    setClassError(false);
    setQuestionsError(false);
    setScheduleError(false);
    setTimerError(false);
    setPublishError(false);
};

const [questionBank, setQuestionBank] = useState([]);
const [selectedBankQuestions, setSelectedBankQuestions] = useState([]);
const [isUsingQuestionBank, setIsUsingQuestionBank] = useState(false);

// Add fetch function
const fetchQuestionBank = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('https://apiquizapp.pythonanywhere.com/api/questions/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setQuestionBank(data);
        }
    } catch (error) {
        console.error('Error fetching question bank:', error);
    }
};

// Add useEffect to fetch questions
useEffect(() => {
    fetchQuestionBank();
}, []);

const handlePublishQuizConfirm = async () => {
    clearErrors();
    if (!validateForm()) return;

    try {
        const accessToken = localStorage.getItem('accessToken');
        let questionIds = [];

        if (isUsingQuestionBank) {
            questionIds = selectedBankQuestions.map(q => q.id);
        } else {
            questionIds = await createQuestions(accessToken);
        }

        await createQuiz(accessToken, questionIds);
        setIsSuccessPublishModal(true);
        resetForm();
    } catch (error) {
        console.error('Error in quiz creation:', error);
        setPublishError(true);
    }
};

const validateForm = () => {
    let isValid = true;
    
    if (!quizName.trim()) {
        setQuizNameError(true);
        isValid = false;
    }
    if (!selectedClass) {
        setClassError(true);
        isValid = false;
    }
    if (!questions.length) {
        setQuestionsError(true);
        isValid = false;
    }
    if (!startDate || !endDate || !startTime || !endTime) {
        setScheduleError(true);
        isValid = false;
    }
    
    // Validate that end date/time is after start date/time
    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(endDate, endTime);
    
    if (startDateTime && endDateTime && startDateTime >= endDateTime) {
        setScheduleError(true);
        isValid = false;
    }
    
    return isValid;
};

const createQuestions = async (accessToken) => {
    try {
        const responses = await Promise.all(questions.map(async (q) => {
            // Convert boolean to string for TF questions
            const correct_answer = q.selectedOption === 'trueFalse' ? 
                q.selectedTrueFalseAnswer.toString() : // Convert boolean to string
                q.selectedOption === 'multipleChoice' ? 
                    q.correctAnswers[0] : 
                    q.identificationAnswers[0];

            const questionData = {
                question_text: q.questionText,
                question_type: q.selectedOption === 'multipleChoice' ? 'MC' : 
                             q.selectedOption === 'trueFalse' ? 'TF' : 'ID',
                correct_answer: correct_answer,
                points: parseInt(q.points) || 1,
                option_a: q.choices?.[0] || null,
                option_b: q.choices?.[1] || null,
                option_c: q.choices?.[2] || null,
                option_d: q.choices?.[3] || null
            };

            console.log('Sending question data:', questionData);

            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/questions/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Question creation failed: ${JSON.stringify(errorData)}`);
            }

            return response.json();
        }));

        return responses.map(q => q.id);
    } catch (error) {
        console.error('Question creation error:', error);
        throw error;
    }
};

const createQuiz = async (accessToken, questionIds) => {

    const allQuestionIds = [
        ...selectedBankQuestions.map(q => q.id),
        ...questionIds
    ];
    if (!allQuestionIds.length) {
        throw new Error('No questions selected');
    }
    // Validate question IDs
    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
        throw new Error('No questions selected');
    }
    if (!startDate || !endDate || !timeHours || !timeMinutes) {
        throw new Error('Missing date or time inputs');
    }

    // Format dates with timezone
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);
    
    // Set hours and minutes
    // Combine dates and times
    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(endDate, endTime);

    if (!startDateTime || !endDateTime) {
        throw new Error('Missing date or time inputs');
    }

    const totalMinutes = parseInt(timeHours) * 60 + parseInt(timeMinutes);
    
    const quizData = {
        title: quizName.trim(),
        classes: [parseInt(selectedClass)],
        start_datetime: startDateTime.toISOString(),  // Use the combined datetime
        end_datetime: endDateTime.toISOString(),      // Use the combined datetime
        time_limit_minutes: totalMinutes,
        questions: allQuestionIds,
        show_correct_answers: Boolean(toggleSettings.showAnswer)
    };

    console.log('Full quiz data being sent:', quizData);

    try {
        const response = await fetch('https://apiquizapp.pythonanywhere.com/api/quizzes/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Quiz creation error:', errorData);
            throw new Error(JSON.stringify(errorData));
        }

        const result = await response.json();
        console.log('Quiz creation response:', result);
        return result;
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw error;
    }
};

const getQuestionTypeDisplay = (type) => {
    if (type === 'MC') {
      return (
        <div className="QUizzesTeacher__type-container-bank">
          <span className="CustomDropdown__selected-icon"><IoMdRadioButtonOn/></span>
          <span className="CustomDropdown__item-title">Multiple Choice</span>
        </div>
      );
    } else if (type === 'ID') {
      return (
        <div className="QUizzesTeacher__type-container-bank">
          <span className="CustomDropdown__selected-icon"><HiOutlineBars3BottomLeft/></span>
          <span className="CustomDropdown__item-title">Identification</span>
        </div>
      );
    } else if (type === 'TF') {
      return (
        <div className="QUizzesTeacher__type-container-bank">
          <span className="CustomDropdown__selected-icon"><IoIosCheckmarkCircleOutline/></span>
          <span className="CustomDropdown__item-title">True/False</span>
        </div>
      );
    }
  };

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
    return (
        <div className="QuizzesTeacher__questions">
            <div className={`QuizzesTeacher__questions-next ${isScrolled ? 'scrolled' : ''}`}>
                <div className="QuizzesTeacher__header-container">
                    <h2 className="QuizzesTeacher__header-question">Questions</h2>
                    <p className="QuizzesTeacher__para-question">Name and describe your quiz so that students can understand it</p>
                </div>
                <button className="QuizzesTeacher__nextButton" onClick={handleNext}>
                    Next
                </button>
            </div>

            <div className="QuizzesTeacher__questionCard" ref={questionCardRef}>
                <div className="QuizzesTeacher__question-creation">
                    {/* Selected Bank Questions */}
                    {selectedBankQuestions.map((question, index) => (
                        <div key={question.id} className="QuizzesTeacher__separator">
                                <div className="QuizzesTeacher__sidebar">
                                    <div className="QuizzesTeacher__sidebar-question">Question {index + 1}</div>
                                    <div className="QuizzesTeacher__sidebar-question-select">
                                        <label className="QuizzesTeacher__bank-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedBankQuestions.some(q => q.id === question.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedBankQuestions(prev => [...prev, question]);
                                                    } else {
                                                        setSelectedBankQuestions(prev => 
                                                            prev.filter(q => q.id !== question.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            Select Question
                                        </label>
                                    </div>
                                    <div className="QuizzesTeacher__sidebar-question-ans-key" onClick={handlePreviewAnswerKey(question.id)}>
                                        <LuClipboardCheck className="QuizzesTeacher__sidebar-question-ans-key-icon"/>
                                        Answer Key: 
                                        
                                    </div>
                                </div>

                                <div className="QuizzesTeacher__main">
                                    <div className="QuizzesTeacher__ques-main-content">
                                        <div className="QuizzesTeacher__input-container">
                                            <label className="QuizzesTeacher__ques-main-label">Question Text</label>
                                            <input
                                                type="text"
                                                className="QuizzesTeacher__input"
                                                value={question.question_text}
                                                disabled
                                            />
                                        </div>
                                        <div className="QuizzesTeacher__type-point-container">
                                            <div className="QuizzesTeacher__input-container">
                                                <label className="QuizzesTeacher__ques-main-label">Question Type</label>
                                                {getQuestionTypeDisplay(question.question_type)}
                                            </div>
                                            <div className="QuizzesTeacher__input-container">
                                                <label className="QuizzesTeacher__ques-main-label">
                                                    Set Points<span className="QuizzesTeacher__ques-main-required">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="QuizzesTeacher__input"
                                                    value={question.points}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                    ))}

                        {questions.map((question, index) => (
                            <div key={question.id} className="QuizzesTeacher__separator">
                                <div className="QuizzesTeacher__sidebar">
                                    <div className="QuizzesTeacher__sidebar-question">
                                    Question {selectedBankQuestions.length + index + 1}
                                    </div>
                                    <div className="QuizzesTeacher__sidebar-question-dup-del">
                                        <div 
                                            className="QuizzesTeacher__duplicate"
                                            onClick={() => handleDuplicateQuestion(question.id)}
                                        >
                                            <TbCopy className="QuizzesTeacher__duplicate-icon"/>
                                            Duplicate
                                        </div>
                                        <div className="QuizzesTeacher__dup-del-line"></div>
                                        <div 
                                            className={`QuizzesTeacher__delete ${questions.length === 1 ? 'disabled' : ''}`}
                                            onClick={() => handleDeleteQuestion(question.id)}
                                        >
                                            <FiTrash2 className="QuizzesTeacher__duplicate-icon"/>
                                            Delete
                                        </div>
                                    </div>
                                    <div 
                                        className={`QuizzesTeacher__sidebar-question-ans-key ${!isAnswerKeyEnabled(question) ? 'disabled' : ''}`} 
                                        onClick={isAnswerKeyEnabled(question) ? () => handleAnswerKeyClick(question.id) : undefined}
                                    >
                                        <LuClipboardCheck className="QuizzesTeacher__sidebar-question-ans-key-icon"/>
                                        Answer Key
                                        <span 
                                        
                                        style={{ display: errorStates.answerKey[question.id] ? 'block' : 'none',
                                            fontWeight:"400"
                                         }}
                                        className="QuizzesTeacher__error-answer-key">
                                            Please set an answer key
                                        </span>
                                    </div>
                                </div>

                                <div className="QuizzesTeacher__main">
                                    <div className="QuizzesTeacher__ques-main-content">
                                        <div className="QuizzesTeacher__input-container">
                                            <label className="QuizzesTeacher__ques-main-label">
                                                Question
                                                <span className="QuizzesTeacher__ques-main-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="QuizzesTeacher__input"
                                                placeholder="This is a question..."
                                                value={question.questionText}
                                                onChange={(e) => handleQuestionTextChange(e.target.value, question.id)}
                                                
                                            />
                                            <span 
                                                style={{ display: errorStates.questionText[question.id] ? 'block' : 'none' }}
                                                className="QuizzesTeacher__error-question-text">
                                                Question text is required
                                            </span>
                                        </div>
                                        <div className="QuizzesTeacher__type-point-container">
                                            <div className="QuizzesTeacher__input-container">
                                                <label className="QuizzesTeacher__ques-main-label">
                                                    Question Type<span className="QuizzesTeacher__ques-main-required">*</span>
                                                </label>
                                                <CustomDropdown
                                                    options={options}
                                                    selectedValue={question.selectedOption}
                                                    onOptionSelect={(option) => handleOptionSelect(option, question.id)}
                                                    heightDropdown='45'
                                                />
                                                <span 
                                                style={{ display: errorStates.multipleFilled[question.id] ? 'block' : 'none' }}
                                                className="QuizzesTeacher__error-choice-text">
                                                    All choices must be filled
                                                </span>
                                            </div>
                                            <div className="QuizzesTeacher__input-container">
                                                <label className="QuizzesTeacher__ques-main-label">
                                                    Set Points<span className="QuizzesTeacher__ques-main-required">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="QuizzesTeacher__input"
                                                    value={question.points}
                                                    onChange={(e) => handlePointsChange(e.target.value, question.id)}
                                                    
                                                />
                                                <span 
                                                style={{ display: errorStates.pointText[question.id] ? 'block' : 'none' }}
                                                className="QuizzesTeacher__error-question-text">
                                                    Points are required
                                                </span>
                                            </div>
                                        </div>
                                        {question.selectedOption === "multipleChoice" && (
                                            <div className="QuizzesTeacher__type-choice-container">
                                                {question.choices.map((choice, index) => (
                                                    <div key={index} className="QuizzesTeacher__choice-item">
                                                        <input
                                                            type="radio"
                                                            name={`correctAnswer_${question.id}`}
                                                            className="QuizzesTeacher__choice-radio"
                                                            disabled
                                                        />
                                                        <input
                                                            type="text"
                                                            className="QuizzesTeacher__choice-input"
                                                            value={choice}
                                                            placeholder={`Answer ${index + 1}`}
                                                            onChange={(e) => handleChoiceChange(e.target.value, index, question.id)}
                                                        />
                                                        <button
                                                            className="QuizzesTeacher__delete-choice"
                                                            onClick={() => handleDeleteChoice(index, question.id)}
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                ))}
                                                {question.choices.length < 4 && (
                                                    <button
                                                        className="QuizzesTeacher__add-choice"
                                                        onClick={() => handleAddChoice(question.id)}
                                                    >
                                                        <IoIosAddCircleOutline className="QuizzesTeacher__add-choice-icon"/>
                                                        Add option
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {question.selectedOption === "identification" && (
                                            <div className="QuizzesTeacher__type-identification-container">
                                                <input
                                                    type="text"
                                                    className="QuizzesTeacher__identification-input"
                                                    placeholder="Short-answer text"
                                                    disabled
                                                />
                                            </div>
                                        )}
                                        {question.selectedOption === "trueFalse" && (
                                            <div className="QuizzesTeacher__type-true-false-container">
                                                <div className="QuizzesTeacher__true-container">
                                                    <IoIosCheckmarkCircleOutline className="QuizzesTeacher__true-icon"/> 
                                                    True
                                                </div>  
                                                <div className="QuizzesTeacher__false-container">
                                                    <IoIosCloseCircleOutline className="QuizzesTeacher__false-icon"/> 
                                                    False
                                                </div>  
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Add Question Options */}
                    <div className="QuizzesTeacher__add-options">
                        <div 
                            className="QuizzesTeacher__add-bank"
                            onClick={() => setIsUsingQuestionBank(true)}
                        >
                            Add from Question Bank +
                        </div>
                        <div 
                            className="QuizzesTeacher__add-question"
                            onClick={handleAddQuestion}
                        >
                            Add new question +
                        </div>
                    </div>

                    {/* Question Bank Modal */}
                    <QuestionBankModal
                        isOpen={isUsingQuestionBank}
                        onClose={() => setIsUsingQuestionBank(false)}
                        questions={questionBank}
                        selectedQuestions={selectedBankQuestions}
                        onSelect={(question) => {
                            if (selectedBankQuestions.some(q => q.id === question.id)) {
                                setSelectedBankQuestions(prev => 
                                    prev.filter(q => q.id !== question.id)
                                );
                            } else {
                                setSelectedBankQuestions(prev => [...prev, question]);
                            }
                        }}
                    />
                 
                </div>
            </div>
        </div>
    );
            case 2:
                return(
                    <div className="QuizzesTeacher__questions">
                        <div className={`QuizzesTeacher__questions-next ${isScrolled ? 'scrolled' : ''}`}>
                            <div className="QuizzesTeacher__header-container">
                                <h2 className="QuizzesTeacher__header-question">Settings</h2>
                                <p className="QuizzesTeacher__para-question">Configure your quiz so that students can understand it</p>
                            </div>
                            <div>     
                                <button 
                                    className="QuizzesTeacher__backButton" 
                                    onClick={handleBack}
                                >
                                    Back
                                </button>
                                <button 
                                    className="QuizzesTeacher__nextButton"
                                    onClick={handlePublishQuizConfirm}
                                    style={{ padding: '12px 35px' }}
                                >
                                    Publish Quiz
                                </button> 
                            </div>
                        </div>

                        <div className="QuizzesTeacher__general-container">
                            <h2 className="QuizzesTeacher__general-header">General</h2>

                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">Quiz name<span className="QuizzesTeacher__ques-main-required">*</span></label>
                                    <p className="QuizzesTeacher__input-description">Name your quiz so that students can easily identify it</p>
                                </div>
                                <input 
                                    type="text" 
                                    className="QuizzesTeacher__text-input" 
                                    placeholder="Enter quiz name" 
                                    autoComplete="off"
                                    value={quizName}
                                    onChange={handleQuizNameChange}
                                />
                                <span 
                                    className="QuizzesTeacher__error-quiz-name"
                                    style={{ display: quizNameError ? 'block' : 'none' }}
                                >
                                    Quiz name is required
                                </span>
                            </div>

                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">Show answer</label>
                                    <p className="QuizzesTeacher__input-description">After the release of grades, students can see the answer key</p>
                                </div>
                                <label className="QuizzesTeacher__toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={toggleSettings.showAnswer}
                                        onChange={() => handleToggleChange('showAnswer')}
                                    />
                                    <span className="QuizzesTeacher__toggle-slider"></span>
                                </label>
                            </div>

                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">Point values</label>
                                    <p className="QuizzesTeacher__input-description">Students can see total points and points received for each question</p>
                                </div>
                                <label className="QuizzesTeacher__toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={toggleSettings.pointValues}
                                        onChange={() => handleToggleChange('pointValues')}    
                                    />
                                    <span className="QuizzesTeacher__toggle-slider"></span>
                                </label>
                            </div>

                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">Missed questions</label>
                                    <p className="QuizzesTeacher__input-description">Students can see which questions were answered incorrectly</p>
                                </div>
                                <label className="QuizzesTeacher__toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={toggleSettings.missedQuestions}
                                        onChange={() => handleToggleChange('missedQuestions')}
                                    />
                                    <span className="QuizzesTeacher__toggle-slider"></span>
                                </label>
                            </div>

                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">Correct answers</label>
                                    <p className="QuizzesTeacher__input-description">Students can see correct answers after grades are released</p>
                                </div>
                                <label className="QuizzesTeacher__toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={toggleSettings.correctAnswers}
                                        onChange={() => handleToggleChange('correctAnswers')}
                                    />
                                    <span className="QuizzesTeacher__toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="QuizzesTeacher__general-container">
                            <h2 className="QuizzesTeacher__general-header">Assignation</h2>

                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">
                                        Assign to a class
                                        <span className="QuizzesTeacher__ques-main-required">*</span>
                                    </label>
                                    <p className="QuizzesTeacher__input-description">Assign your quiz to a class</p>
                                </div>
                                <div className="QuizzesTeacher__width-dropdown">
                                    <CustomDropdown
                                        options={classOptions}
                                        selectedValue={selectedClass}
                                        onOptionSelect={(option) => setSelectedClass(option.value)}
                                        placeholder="Select Class"
                                        heightDropdown={40}
                                    />
                                </div>
                                <span 
                                    className="QuizzesTeacher__error-quiz-name"
                                    style={{ display: classError ? 'block' : 'none' }}
                                >
                                    Assign class is required
                                </span>
                            </div>
                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">
                                        Set timer
                                        <span className="QuizzesTeacher__ques-main-required">*</span>
                                    </label>
                                    <p className="QuizzesTeacher__input-description">Create a timer to limit the time it takes for the student to answer the quiz</p>
                                </div>
                                <div className="QuizzesTeacher__schedule-container">
                                    <ScrollableTimePicker 
                                          onTimeChange={handleTimeChange} 
                                    />
                                </div>
                                <span 
                                    className="QuizzesTeacher__error-quiz-name"
                                    style={{ display: timerError ? 'block' : 'none' }}
                                >
                                    Set timer is required
                                </span>
                            </div>
                            <div className="QuizzesTeacher__quiz-name-group">
                                <div>
                                    <label className="QuizzesTeacher__input-label">
                                        Schedule quiz
                                        <span className="QuizzesTeacher__ques-main-required">*</span>
                                    </label>
                                    <p className="QuizzesTeacher__input-description">Set a schedule for when the quiz will be released and accessible</p>
                                </div>
                                <div className="QuizzesTeacher__schedule-container">
                                    <div className="QuizzesTeacher__datetime-row">
                                        <div className="QuizzesTeacher__date-picker">
                                            <CustomDatePicker
                                                selectedDate={startDate}
                                                onChange={handleStartDateChange}
                                                label="Start Date"
                                            />
                                            <TimePicker
                                            value={startTime}
                                            onChange={handleStartTimeChange}
                                            label=""
                                            className="QuizzesTeacher__time-picker"
                                            placeholder="Start Time"
                                        />
                                        </div>
                                        
                                    </div>
                                    <div className="QuizzesTeacher__datetime-row">
                                        <div className="QuizzesTeacher__date-picker">
                                            <CustomDatePicker
                                                selectedDate={endDate}
                                                onChange={handleEndDateChange}
                                                label="End Date"
                                            />
                                            <TimePicker
                                            value={endTime}
                                            onChange={handleEndTimeChange}
                                            label=""
                                            className="QuizzesTeacher__time-picker"
                                            placeholder="End Time"
                                        />
                                        </div>
                                        
                                    </div>
                                </div>
                                <span 
                                    className="QuizzesTeacher__error-quiz-name"
                                    style={{ display: scheduleError ? 'block' : 'none' }}
                                >
                                    Schedule quiz is required
                                </span>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    // MAIN CONTENT 
    return(
        <>
            <nav className="QuizzesTeacher__breadcrumb">
                <span>Quizzes</span>
                <span> &gt; </span>
                <span>Step 1</span>
                {currentStep === 2 && (
                    <>
                        <span> &gt; </span>
                        <span>Step 2</span>
                    </>
                )}
            </nav>

            {/* Header with Progress */}
            <div className="QuizzesTeacher__header-content">
                <div className="QuizzesTeacher__header-container">
                    <p className="QuizzesTeacher__para-container">Step {currentStep}</p>
                    <h2  className="QuizzesTeacher__header-header">
                        {currentStep === 1 && "Generate Quiz Questions and Answers"}
                        {currentStep === 2 && "Configure Quiz Settings"}
                    </h2>
                </div>
            </div>
            <div className="QuizzesTeacher__progressBar">
                <div className="QuizzesTeacher__progress Fill" style={{ width: "50%" }}></div>
                <div className={`QuizzesTeacher__progress ${currentStep === 2 ? 'Fill': ''}`} style={{ width: "50%" }}></div>
            </div>
           
            {/* Dynamic Step Content */}
            {getStepContent()}
            
            <AnswerKeyModal
                isOpen={isAnswerKeyModal}
                onClose={()=>setIsAnswerKeyModal(false)}
                onConfirm={handleAnswerKeyConfirm}
                questionType={currentQuestionId ? questions.find(q => q.id === currentQuestionId)?.selectedOption : ""}
                questionText={currentQuestionId ? questions.find(q => q.id === currentQuestionId)?.questionText : ""}
                choices={currentQuestionId ? questions.find(q => q.id === currentQuestionId)?.choices : []}
                correctAnswers={currentQuestionId ? questions.find(q => q.id === currentQuestionId)?.correctAnswers : []}
                identificationAnswers={currentQuestionId ? questions.find(q => q.id === currentQuestionId)?.identificationAnswers : []}
                selectedTrueFalseAnswer={currentQuestionId ? questions.find(q => q.id === currentQuestionId)?.selectedTrueFalseAnswer : null}
                markOthersIncorrect={currentQuestionId ? questions.find(q => q.id === currentQuestionId)?.markOthersIncorrect : false}
            />

            <QuizAnswerKeyPreview
                isOpen={isPreviewModal}
                onClose={() => setIsPreviewModal(false)}
                question={selectedBankQuestions.find(q => q.id === currentQuestionId)}
            />

            <SuccessPublishModal
                isOpen={isSuccessPublishModal}
                onClose={()=> setIsSuccessPublishModal(false)}
            />
        </>
    );
};