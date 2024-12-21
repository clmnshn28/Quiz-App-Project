import React, { useState, useEffect } from "react";
import 'assets/css/auth';
import * as images from 'assets/images';
import PasswordRequirements from 'components/PasswordRequirements';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";

export const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        is_teacher: false,
    });
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const options = [
        { value: true, title: "Teacher" },
        { value: false, title: "Student" },
    ];

    const handleSelect = (option) => {
        setFormData(prev => ({
            ...prev,
            is_teacher: option.value
        }));
        setIsDropdownOpen(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    is_teacher: formData.is_teacher,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful - now login
                const loginResponse = await fetch('https://apiquizapp.pythonanywhere.com/api/token/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    localStorage.setItem('accessToken', loginData.access);
                    localStorage.setItem('refreshToken', loginData.refresh);
                    navigate(formData.is_teacher ? '/teacher-dashboard' : '/student-dashboard');
                }
            } else {
                // Handle validation errors from the server
                setErrors(data);
            }
        } catch (error) {
            setErrors({ general: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.CustomDropdown')) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className="SignUpUser__background">
            <div className="SignUpUser__left-container">
                <img src={images.loginBanner} className="SignUpUser__image-cover" alt="Login Cover"/>
            </div>

            <div className="SignUpUser__right-container">
                <img src={images.loginLogo} className="SignUpUser__image-logo" alt="Login Logo"/>
                <div className="SignUpUser__login-content">
                    <h1>Register</h1>
                    <div className="SignUpUser__card-body">
                        <form onSubmit={handleSubmit}>
                            {errors.general && (
                                <div className="RegisterUser__error-general-message">
                                    {errors.general}
                                </div>
                            )}
                            
                            {/* Username field */}
                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="username" className="SignUpUser__input-label">
                                    Username
                                </label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    className="SignUpUser__input-field" 
                                    value={formData.username}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                {errors.username && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errors.username}
                                    </span>
                                )}
                            </div>

                            {/* Email field */}
                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="email" className="SignUpUser__input-label">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="SignUpUser__input-field" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                {errors.email && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Password fields */}
                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="password" className="SignUpUser__input-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="SignUpUser__input-field"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                {errors.password && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="confirmPassword" className="SignUpUser__input-label">
                                    Confirm Password
                                </label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    className="SignUpUser__input-field" 
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                                {errors.confirmPassword && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errors.confirmPassword}
                                    </span>
                                )}
                            </div>

                            {/* User type dropdown */}
                            <div className="RegisterUser__register-inputs">
                                <label className="SignUpUser__input-label">
                                    I am registering as a...
                                </label>
                                <div className="CustomDropdown">
                                    <button
                                        type="button"
                                        className="CustomDropdown__button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {options.find((opt) => opt.value === formData.is_teacher)?.title || "Select an option"}
                                        {isDropdownOpen ? (
                                            <MdArrowDropUp className="CustomDropdown__custom-icon" />
                                        ) : (
                                            <MdOutlineArrowDropDown className="CustomDropdown__custom-icon" />
                                        )}
                                    </button>
                                    
                                    {isDropdownOpen && (
                                        <div className="CustomDropdown__menu">
                                            {options.map((option) => (
                                                <div
                                                    key={option.value.toString()}
                                                    className="CustomDropdown__item"
                                                    onClick={() => handleSelect(option)}
                                                >
                                                    <div className="CustomDropdown__item-title">
                                                        {option.title}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="password-instruction">
                                <PasswordRequirements newPassword={formData.password}/>
                            </div>

                            <button 
                                type="submit" 
                                className="SignUpUser__submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                    </div>
                    <p className="SignUpUser_register-here">
                        Already have an account? <Link to="/sign-in">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};