import React, {useState} from "react";
import 'assets/css/auth';
import * as images from 'assets/images';

import { TbEye ,TbEyeClosed } from "react-icons/tb";
import { Link } from 'react-router-dom';

export const SignIn = () =>{

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username !== "cece" || password !== "password") {
            setErrorMessage("Invalid username or password");
            return;
        }

      
        setErrorMessage('');
        console.log("Login successful");
    
    };

    

    return(
        <div className="LoginUser__background">
            <div className="LoginUser__left-container">
                <img src={images.loginBanner} className="LoginUser__image-cover " alt="Login Cover"/>
            </div>

            <div className="LoginUser__right-container">
                <img src={images.loginLogo} className="LoginUser__image-logo" alt="Login Logo"/>
                <div className="LoginUser__login-content">
                    <h1>Login</h1>
                    <div className="LoginUser__card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="RegisterUser__register-inputs">
                                <label  htmlFor="username"  className="LoginUser__input-label">
                                    Username or Email
                                </label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    className="LoginUser__input-field " 
                                    value={username}
                                    onChange={handleUsernameChange}
                                    autoComplete="off"
                                    required
                                />
                                {errorMessage && (
                                    <span className="RegisterUser__error-user-pass-message">
                                        {errorMessage}
                                        {/* <span class="RegisterUser__error-user-pass-message">Invalid username or password</span> */}
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
                                    {showPassword ?  <TbEyeClosed className="LoginUser__eye-icon"/> : <TbEye className="LoginUser__eye-icon"/>}
                                </span>
                                </div>
                                
                            </div>
                            <div className="LoginUser__forgot-password-container">
                                <a href="/forgot-password">Forgot password</a>
                            </div>

                            <button type="submit" className="LoginUser__submit-btn">
                                Login
                            </button>
                        </form>
                      
                    </div>
                    <p className="LoginUser_register-here">
                        Don’t have an account?  <Link to="/sign-up">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
        
    );
};
