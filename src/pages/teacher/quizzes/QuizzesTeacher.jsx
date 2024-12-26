import React, {useState, useEffect, useRef } from "react";
import 'assets/css/teacher';
import CustomDropdown from "components/CustomDropdown";
import CustomDatePicker from 'components/CustomDatePicker';
import ScrollableTimePicker from 'components/ScrollableTimePicker';

import { LuClipboardCheck } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { IoMdRadioButtonOn, IoIosCheckmarkCircleOutline, IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

import { AnswerKeyModal, SuccessPublishModal } from "./modals";

export const QuizzesTeacher = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;

    const [questions, setQuestions] = useState([{
        id: 1,
        questionText: "",
        selectedOption: 'multipleChoice',
        choices: [""],
        points: "",
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

        questions.forEach(question => {
            // Question text validation
            if (!question.questionText.trim()) {
                newErrorStates.questionText[question.id] = true;
                hasErrors = true;
            }

            // Points validation
            if (!question.points.trim()) {
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
            if (!question.correctAnswers.length && 
                !question.identificationAnswers[0] && 
                question.selectedTrueFalseAnswer === null) {
                newErrorStates.answerKey[question.id] = true;
                hasErrors = true;
            }
        });

        setErrorStates(newErrorStates);

        if (!hasErrors && currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

// Step 2 useStates
    const [selectedClass, setSelectedClass] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [timeHours, setTimeHours] = useState('00');
    const [timeMinutes, setTimeMinutes] = useState('00');

    const [quizName, setQuizName] = useState('');
    const [quizNameError, setQuizNameError] = useState(false);
    const [classError, setClassError] = useState(false);
    const [timerError, setTimerError] = useState(false);
    const [scheduleError, setScheduleError] = useState(false);

    const [toggleSettings, setToggleSettings] = useState({
        showAnswer: false,
        pointValues: false,
        missedQuestions: false,
        correctAnswers: false
    });

    // Class options
     const classOptions = [
        { value: "classA", title: "Class A" },
        { value: "classB", title: "Class B" },
        { value: "classC", title: "Class C" },

    ];
    
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

    // assign class
    const handleClassSelect = (option) => {
          setSelectedClass(option.value);
        if (option.value) {
            setClassError(false);
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
    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date && endDate) {
            setScheduleError(false);
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (startDate && date) {
            setScheduleError(false);
        }
    };

    const handlePublishQuizConfirm = () => {
        let hasError = false;
        
        // Check if quiz name is empty
        if (!quizName.trim()) {
            setQuizNameError(true);
            hasError = true;
        }

        // Check if class is selected
        if (!selectedClass) {
            setClassError(true);
            hasError = true;
        }

        // Check if timer is set (not 00:00)
        if (timeHours === '00' && timeMinutes === '00') {
            setTimerError(true);
            hasError = true;
        }

        // Check if both dates are selected
        if (!startDate || !endDate) {
            setScheduleError(true);
            hasError = true;
        }


        if (!hasError) {
            setIsSuccessPublishModal(true);
            const quizData = {
                name: quizName,
                settings: {
                    ...toggleSettings,
                    timeHours,
                    timeMinutes,
                    startDate,
                    endDate,
                    selectedClass
                },
                questions
            };
            console.log("Quiz data to submit:", quizData);
        }
    };


    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return(
                <div className="QuizzesTeacher__questions">
                    <div className={`QuizzesTeacher__questions-next ${isScrolled ? 'scrolled' : ''}`}>
                        <div className="QuizzesTeacher__header-container">
                            <h2 className="QuizzesTeacher__header-question">Questions</h2>
                            <p>Name and describe your quiz so that students can understand it</p>
                        </div>
                        <div>     
                            <button 
                                className="QuizzesTeacher__nextButton" 
                                onClick={handleNext}
                            >
                                Next
                            </button>  
                        </div>
                    </div>
                    <div
                        className={`QuizzesTeacher__questionCard`}
                        ref={questionCardRef}
                    >
                        {questions.map((question, index) => (
                            <div key={question.id} className="QuizzesTeacher__separator">
                                <div className="QuizzesTeacher__sidebar">
                                    <div className="QuizzesTeacher__sidebar-question">Question {index + 1}</div>
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
                        <div 
                            className="QuizzesTeacher__add-question"
                            onClick={handleAddQuestion}
                        >
                            Add new question +
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
                                <p>Configure your quiz so that students can understand it</p>
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
                                        onOptionSelect={handleClassSelect}
                                        heightDropdown='45'
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
                                    <div className="QuizzesTeacher__date-group">
                                        <label className="QuizzesTeacher__date-label">Start Date</label>
                                        <CustomDatePicker
                                            selectedDate={startDate}
                                            onChange={handleStartDateChange}
                                        />
                                    </div>
                                    <div className="QuizzesTeacher__date-group">
                                        <label className="QuizzesTeacher__date-label">End Date</label>
                                        <CustomDatePicker
                                            selectedDate={endDate}
                                            onChange={handleEndDateChange}
                                        />
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
                    <p>Step {currentStep}</p>
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

            <SuccessPublishModal
                isOpen={isSuccessPublishModal}
                onClose={()=> setIsSuccessPublishModal(false)}
            />
        </>
    );
};