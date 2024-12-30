import React, { useState, useEffect, useRef } from 'react';
import '../assets/css/components/TimePicker.css';

const TimePicker = ({ 
    value, 
    onChange, 
    placeholder = "Select Time",
    className,
    style,
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState('--');
    const [selectedMinute, setSelectedMinute] = useState('--');
    const [period, setPeriod] = useState('--');
    const dropdownRef = useRef(null);

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    useEffect(() => {
        if (value) {
            const [time, meridian] = value.split(' ');
            const [hour, minute] = time.split(':');
            setSelectedHour(hour);
            setSelectedMinute(minute);
            setPeriod(meridian || 'AM');
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTimeSelect = (hour, minute, newPeriod) => {
        const selectedPeriod = newPeriod || period;
        const formattedTime = `${hour}:${minute} ${selectedPeriod}`;
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setPeriod(selectedPeriod);
        onChange?.(formattedTime);
    };

    const togglePeriod = () => {
        const newPeriod = period === 'AM' ? 'PM' : 'AM';
        handleTimeSelect(selectedHour, selectedMinute, newPeriod);
    };

    const displayTime = `${selectedHour}:${selectedMinute} ${period}`;

    return (
        <div className={`TimePicker__time-picker-container ${className || ''}`} ref={dropdownRef}>
            {label && (
                <span className="time-picker-label" style={{ 
                    color: '#9E9E9E', 
                    fontSize: '20px' 
                }}>
                    {label}
                </span>
            )}
            <input
                type="text"
                value={displayTime}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                className="TimePicker__time-picker-input"
                placeholder={placeholder}
                style={style}
            />
            {isOpen && (
                <div className="TimePicker__time-dropdown">
                    <div className="time-columns">
                        <div className="TimePicker__time-column">
                            {hours.map(hour => (
                                <div
                                    key={hour}
                                    onClick={() => handleTimeSelect(hour, selectedMinute)}
                                    className="time-option"
                                >
                                    {hour}
                                </div>
                            ))}
                        </div>
                        <div className="TimePicker__time-column">
                            {minutes.map(minute => (
                                <div
                                    key={minute}
                                    onClick={() => handleTimeSelect(selectedHour, minute)}
                                    className="time-option"
                                >
                                    {minute}
                                </div>
                            ))}
                        </div>
                        <div className="TimePicker__time-column period-column">
                            <div
                                onClick={togglePeriod}
                                className={`time-option period-option ${period === 'AM' ? 'active' : ''}`}
                            >
                                AM
                            </div>
                            <div
                                onClick={togglePeriod}
                                className={`time-option period-option ${period === 'PM' ? 'active' : ''}`}
                            >
                                PM
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;