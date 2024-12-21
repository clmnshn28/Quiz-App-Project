import React, {useState, useEffect} from "react";
import 'assets/css/student';

import { BiEditAlt } from "react-icons/bi";

export const ProfileTeacher = () =>{

    const[fname, setFname] = useState('');
    const[lname, setLname] = useState('');
    const[username, setUsername] = useState('');
    const[email, setEmail] = useState('');
    const[oldPassword, setOldPassword] = useState('');
    const[newPassword, setNewPassword] = useState('');
    const[confirmNewPassword, setConfirmNewPassword] = useState('');

    const [errorUsernameMessage, setErrorUsernameMessage] = useState('');
    const [errorEmailMessage, setErrorEmailMessage] = useState('');
    const [errorPasswordMessage, setErrorPasswordMessage] = useState('');

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    

    const [profilePicture, setProfilePicture] = useState(
        "https://via.placeholder.com/100" // Default profile picture
    );
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const handleEditProfile = () => setIsEditingProfile(true);
    const handleEditPassword = () => setIsEditingPassword(true);

    const handleSaveProfile = () => setIsEditingProfile(false);
    const handleSavePassword = () => setIsEditingPassword(false);

    const handleChangePicture = () => {
        // Logic to change picture
        alert("Change picture functionality");
    };

    const handleRemovePicture = () => {
        setProfilePicture("https://via.placeholder.com/100"); // Reset to default
    };


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


    
    return(
        <>
            <div className="HomeStudent__main-header">
                <h1>Settings</h1>
            </div>

            <div className="ProfileStudent__profile-container">
                <div className="ProfileStudent__card-header">
                    <h5 className="ProfileStudent__card-header-user fw-bold">User Profile</h5>
                    <BiEditAlt className="ProfileStudent__edit-icon"/>
                </div>
                <form method="post" className="ProfileStudent__card-body">
                    <div className="ProfileStudent__picture-section">
                        <label className="ProfileStudent__profile-label">Profile Picture</label>
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="ProfileStudent__profile-picture"
                        />
                        <div className="ProfileStudent__picture-buttons">
                            <button
                                type="button"
                                className="ProfileStudent__button change"
                                onClick={handleChangePicture}
                            >
                                Change picture
                            </button>

                            <button
                                type="button"
                                className="ProfileStudent__button remove"
                                onClick={handleRemovePicture}
                            >
                                Remove picture
                            </button>
                        </div>
                    </div>

                    <div className="ProfileStudent__form-group">
                        <label>First Name</label>
                        <input
                        type="text"
                        value="John Doe"
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        />
                    </div>
                    <div className="ProfileStudent__form-group">
                        <label>Last Name</label>
                        <input
                        type="text"
                        value="John Doe"
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        />
                    </div>
                    <div className="ProfileStudent__form-group">
                        <label>Username</label>
                        <input
                        type="text"
                        value="John Doe"
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        />
                    </div>
                    <div className="ProfileStudent__form-group">
                        <label>Email Address</label>
                        <input
                        type="text"
                        value="John Doe"
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        />
                    </div>

                </form>
            </div>

            <div className="ProfileStudent__profile-container">
                <div className="ProfileStudent__card-header">
                    <h5 className="ProfileStudent__card-header-user fw-bold">Change Password</h5>
                    <BiEditAlt className="ProfileStudent__edit-icon"/>
                </div>

                <div className="ProfileStudent__form-group">
                    <label>Old Password</label>
                    <input
                    type="text"
                    value="John Doe"
                    disabled={!isEditingPassword}
                    className="ProfileStudent__input"
                    />
                </div>
                <div className="ProfileStudent__form-group">
                    <label>New PAssword</label>
                    <input
                    type="text"
                    value="John Doe"
                    disabled={!isEditingPassword}
                    className="ProfileStudent__input"
                    />
                </div>
                <div className="ProfileStudent__form-group">
                    <label>Confirm Password</label>
                    <input
                    type="text"
                    value="John Doe"
                    disabled={!isEditingPassword}
                    className="ProfileStudent__input"
                    />
                </div>
            </div>

        </>
    );
};