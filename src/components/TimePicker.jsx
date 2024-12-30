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
    const [period, setPeriod] = useState('AM');
    const dropdownRef = useRef(null);

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    // Parse the 24-hour format time to 12-hour format
    const parseTime = (timeString) => {
        if (!timeString) return null;
        
        let [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            period
        };
    };

    // Convert 12-hour format back to 24-hour format
    const formatTo24Hour = (hour, minute, period) => {
        if (hour === '--' || minute === '--') return '';
        
        let hours = parseInt(hour);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return `${hours.toString().padStart(2, '0')}:${minute}`;
    };

    useEffect(() => {
        if (value) {
            const parsed = parseTime(value);
            if (parsed) {
                setSelectedHour(parsed.hours);
                setSelectedMinute(parsed.minutes);
                setPeriod(parsed.period);
            }
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
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setPeriod(selectedPeriod);
        
        // Convert to 24-hour format before calling onChange
        const time24 = formatTo24Hour(hour, minute, selectedPeriod);
        if (time24) {
            onChange?.(time24);
        }
    };

    const togglePeriod = () => {
        const newPeriod = period === 'AM' ? 'PM' : 'AM';
        handleTimeSelect(selectedHour, selectedMinute, newPeriod);
    };

    const displayTime = selectedHour === '--' || selectedMinute === '--' 
        ? placeholder 
        : `${selectedHour}:${selectedMinute} ${period}`;

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
                                    className={`time-option ${selectedHour === hour ? 'active' : ''}`}
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
                                    className={`time-option ${selectedMinute === minute ? 'active' : ''}`}
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