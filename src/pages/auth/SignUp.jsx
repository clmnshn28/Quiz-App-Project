import React, {useState, useEffect} from "react";
import 'assets/css/auth';
import * as images from 'assets/images';
import PasswordRequirements from 'components/PasswordRequirements';

import { Link } from 'react-router-dom';
import { MdArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";

export const SignUp = () =>{

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(""); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

    const [errorUsernameMessage, setErrorUsernameMessage] = useState('');
    const [errorEmailMessage, setErrorEmailMessage] = useState('');
    const [errorPasswordMessage, setErrorPasswordMessage] = useState('');
    const [errorUserTypeMessage, setErrorUserTypeMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    
    
    // checking requirement in password
    const isPasswordRequirementMet = (requirement) => {
        switch (requirement) {
        case 'Be 8-100 characters long':
            return password.length >= 8 && password.length <= 100;
        case 'Contain at least one uppercase and one lowercase letter':
            return /[A-Z]/.test(password) && /[a-z]/.test(password);
        case 'Contain at least one number or special character':
            return /\d/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password);
        default:
            return false;
        }
    };

    const options = [
        { value: "True", title: "Teacher" },
        { value: "False", title: "Student" },
    ];

    const handleSelect = (option) => {
        setUserType(option.value);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

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


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!isPasswordRequirementMet('Be 8-100 characters long') ||
            !isPasswordRequirementMet('Contain at least one uppercase and one lowercase letter') ||
            !isPasswordRequirementMet('Contain at least one number or special character')) {
            
            setErrorPasswordMessage('Password does not meet the requirements');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorPasswordMessage('Passwords do not match');
            setLoading(false);
            return; 
        }

        if (!userType) {
            setErrorUserTypeMessage("Select a user type.");
            return;
        }


    };
    
        
    return(
        <div className="SignUpUser__background">
            <div className="SignUpUser__left-container">
                <img src={images.loginBanner} className="SignUpUser__image-cover " alt="Login Cover"/>
            </div>

            <div className="SignUpUser__right-container">
                <img src={images.loginLogo} className="SignUpUser__image-logo" alt="Login Logo"/>
                <div className="SignUpUser__login-content">
                    <h1>Register</h1>
                    <div className="SignUpUser__card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="RegisterUser__register-inputs">
                                <label  htmlFor="username"  className="SignUpUser__input-label">
                                    Username
                                </label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    className="SignUpUser__input-field " 
                                    value={username}
                                    onChange={handleUsernameChange}
                                    autoComplete="off"
                                    required
                                />
                                {errorUsernameMessage && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errorUsernameMessage}
                                    </span>
                                )}
                            </div>
                            <div className="RegisterUser__register-inputs">
                                <label  htmlFor="email"  className="SignUpUser__input-label">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="SignUpUser__input-field " 
                                    value={email}
                                    onChange={handleEmailChange}
                                    autoComplete="off"
                                    required
                                />
                                {errorEmailMessage && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errorEmailMessage}
                                    </span>
                                )}
                            </div>
                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="password" className="SignUpUser__input-label">
                                    Password
                                </label>
                                <div className="RegisterUser__password-content">
                                    <input
                                    type="password"
                                    name="password"
                                    className="SignUpUser__input-field"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    autoComplete="off"
                                    required
                                />
                                </div>
                                {errorPasswordMessage && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errorPasswordMessage}
                                    </span>
                                )}
                            </div>
                            <div className="RegisterUser__register-inputs">
                                <label  htmlFor="confirmPassword"  className="SignUpUser__input-label">
                                    Confirm Password
                                </label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    className="SignUpUser__input-field " 
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="userType" className="SignUpUser__input-label">
                                    I am registering as a...
                                </label>
                                {errorUserTypeMessage && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errorUserTypeMessage}
                                    </span>
                                )}
                                <div className="CustomDropdown">
                                    <button
                                        type="button"
                                        className="CustomDropdown__button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {options.find((opt) => opt.value === userType)?.title || "Select an option"}
                                    </button>
                                    {isDropdownOpen ? (
                                        <MdArrowDropUp className="CustomDropdown__custom-icon" />
                                    ) : (
                                        <MdOutlineArrowDropDown className="CustomDropdown__custom-icon" />
                                    )}
                                    {isDropdownOpen && (
                                        <div className="CustomDropdown__menu">
                                            {options.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="CustomDropdown__item"
                                                    onClick={() => handleSelect(option)}
                                                >
                                                    <div className="CustomDropdown__item-title">{option.title}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="password-instruction">
                                <PasswordRequirements newPassword={password}/>
                            </div>           
                            <button type="submit" className="SignUpUser__submit-btn">
                                Register
                            </button>
                        </form>
                      
                    </div>
                    <p className="SignUpUser_register-here">
                        Don’t have an account?  <Link to="/sign-in">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
