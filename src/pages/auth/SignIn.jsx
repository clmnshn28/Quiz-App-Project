import React, { useState } from "react";
import 'assets/css/auth';
import * as images from 'assets/images';
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';

export const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store tokens in localStorage
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);

                // Get user profile
                const userResponse = await fetch('https://apiquizapp.pythonanywhere.com/api/users/profile/', {
                    headers: {
                        'Authorization': `Bearer ${data.access}`,
                    },
                });
                
                const userData = await userResponse.json();
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect based on user type
                navigate(userData.is_teacher ? '/teacher-dashboard' : '/student-dashboard');
            } else {
                setErrorMessage(data.detail || 'Invalid username or password');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="LoginUser__background">
            <div className="LoginUser__left-container">
                <img src={images.loginBanner} className="LoginUser__image-cover" alt="Login Cover"/>
            </div>

            <div className="LoginUser__right-container">
                <img src={images.loginLogo} className="LoginUser__image-logo" alt="Login Logo"/>
                <div className="LoginUser__login-content">
                    <h1>Login</h1>
                    <div className="LoginUser__card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="username" className="LoginUser__input-label">
                                    Username or Email
                                </label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    className="LoginUser__input-field" 
                                    value={username}
                                    onChange={handleUsernameChange}
                                    autoComplete="off"
                                    required
                                />
                                {errorMessage && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errorMessage}
                                    </span>
                                )}
                            </div>
                            <div className="RegisterUser__register-inputs">
                                <label htmlFor="password" className="LoginUser__input-label">
                                    Password
                                </label>
                                <div className="RegisterUser__password-content">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="LoginUser__input-field"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        autoComplete="off"
                                        required
                                    />
                                    <span
                                        className="LoginUser__toggle-password"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <TbEyeClosed className="LoginUser__eye-icon"/> : <TbEye className="LoginUser__eye-icon"/>}
                                    </span>
                                </div>
                            </div>
                            <div className="LoginUser__forgot-password-container">
                                <Link to="/forgot-password">Forgot password</Link>
                            </div>

                            <button 
                                type="submit" 
                                className="LoginUser__submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                    <p className="LoginUser_register-here">
                        Don't have an account? <Link to="/sign-up">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};