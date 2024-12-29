import React, { useState, useEffect } from 'react';
import '../assets/css/components/TimePicker.css';

const TimePicker = ({ 
    value, 
    onChange, 
    placeholder = "Select Time",
    className,
    style,
    label
  }) => {
    const parseTime = (timeString) => {
      if (!timeString) return '';
      // Remove seconds if they exist
      return timeString.split(':').slice(0, 2).join(':');
    };
  
    const [time, setTime] = useState(parseTime(value));
  
    useEffect(() => {
      setTime(parseTime(value));
    }, [value]);
  
    const handleChange = (e) => {
      const newTimeValue = e.target.value;
      setTime(newTimeValue);
      
      if (onChange) {
        // Just pass the time value without adding seconds
        onChange(newTimeValue);
      }
    };
  
    return (
      <div className={`time-picker-container ${className || ''}`}>
        {label && (
          <span className="time-picker-label" style={{ 
            color: '#9E9E9E', 
            fontSize: '20px' 
          }}>
            {label}
          </span>
        )}
        <input
          type="time"
          value={time}
          onChange={handleChange}
          className="time-picker-input"
          placeholder={placeholder}
          style={style}
        />
      </div>
    );
  };

  export default TimePicker;