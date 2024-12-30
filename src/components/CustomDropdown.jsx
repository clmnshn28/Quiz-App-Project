import React, {useState,useEffect} from "react";
import 'assets/css/components';

import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/ri";

export default function CustomDropdown ({options, selectedValue, onOptionSelect, heightDropdown, placeholder = "Select an option" }){

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (option) => {
      onOptionSelect(option);
      setIsDropdownOpen(false);
    };
  
    const selectedOption = options.find((opt) => opt.value === selectedValue);
  
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.CustomDropdown')) {
                setIsDropdownOpen(false);
            }
        };
        // Add event listener when dropdown is open
        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        // Cleanup on unmount or when dropdown is closed
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]);

    const isPlaceholder = !selectedOption;

    return (
      <div className="CustomDropdown">
        <button
          type="button"
          className="CustomDropdown__button"
          style={{
            height: `${heightDropdown}px`,
            color: isPlaceholder ? "#aaa" : "#56575B",
            }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            {selectedOption?.icon && (
            <span className="CustomDropdown__selected-icon">{selectedOption.icon}</span>
            )}
            {selectedOption?.title || placeholder}
        </button>
        {isDropdownOpen ? (
          <RiArrowDropUpLine className="CustomDropdown__custom-icon" />
        ) : (
          <RiArrowDropDownLine className="CustomDropdown__custom-icon" />
        )}
        {isDropdownOpen && (
          <div className="CustomDropdown__menu">
            {options.map((option) => (
              <div
                key={option.value}
                className="CustomDropdown__item"
                onClick={() => handleSelect(option)}
              >
                {option.icon && (
                <span  className="CustomDropdown__selected-icon">{option.icon}</span>
                )}
              <span className="CustomDropdown__item-title">{option.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}