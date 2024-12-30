import React, { useState, useEffect, useRef } from 'react';
import { GoDotFill } from "react-icons/go";

const ScrollableTimePicker = ({ onTimeChange }) => {
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [isHoursOpen, setIsHoursOpen] = useState(false);
    const [isMinutesOpen, setIsMinutesOpen] = useState(false);
    const hoursRef = useRef(null);
    const minutesRef = useRef(null);

    // Generate hours and minutes arrays
    const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (hoursRef.current && !hoursRef.current.contains(event.target)) {
                setIsHoursOpen(false);
            }
            if (minutesRef.current && !minutesRef.current.contains(event.target)) {
                setIsMinutesOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleHourSelect = (hour) => {
        setHours(hour);
        setIsHoursOpen(false);
        onTimeChange && onTimeChange(hour, minutes);
    };

    const handleMinuteSelect = (minute) => {
        setMinutes(minute);
        setIsMinutesOpen(false);
        onTimeChange && onTimeChange(hours, minute);
    };

    return (
        <div className="QuizzesTeacher__time-picker">
            {/* Hours Section */}
            <div className="QuizzesTeacher__time-section" ref={hoursRef}>
                <input
                    type="text"
                    className="QuizzesTeacher__time-input"
                    value={hours}
                    readOnly
                    onClick={() => setIsHoursOpen(!isHoursOpen)}
                />
                {isHoursOpen && (
                    <div className="QuizzesTeacher__time-dropdown">
                        {hoursArray.map((hour) => (
                            <div
                                key={hour}
                                className={`QuizzesTeacher__time-option ${hours === hour ? 'selected' : ''}`}
                                onClick={() => handleHourSelect(hour)}
                            >
                                {hour}
                            </div>
                        ))}
                    </div>
                )}
                <span className="QuizzesTeacher__time-label">hr</span>
            </div>
            <div className="QuizzesTeacher__time-colon-container">
                <GoDotFill className='QuizzesTeacher__time-colon'/>   
                <GoDotFill className='QuizzesTeacher__time-colon'/>   
            </div>
            {/* Minutes Section */}
            <div className="QuizzesTeacher__time-section" ref={minutesRef}>
                <input
                    type="text"
                    className="QuizzesTeacher__time-input"
                    value={minutes}
                    readOnly
                    onClick={() => setIsMinutesOpen(!isMinutesOpen)}
                />
                {isMinutesOpen && (
                    <div className="QuizzesTeacher__time-dropdown">
                        {minutesArray.map((minute) => (
                            <div
                                key={minute}
                                className={`QuizzesTeacher__time-option ${minutes === minute ? 'selected' : ''}`}
                                onClick={() => handleMinuteSelect(minute)}
                            >
                                {minute}
                            </div>
                        ))}
                    </div>
                )}
                <span className="QuizzesTeacher__time-label">mins</span>
            </div>
        </div>
    );
};

export default ScrollableTimePicker;