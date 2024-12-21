import React, {useState, useEffect} from "react";
import 'assets/css/student';
import PasswordRequirements from 'components/PasswordRequirements';
import ButtonGroup from 'components/ButtonGroup';

import { BiEditAlt } from "react-icons/bi";

export const ProfileStudent = () =>{

    const[fname, setFname] = useState('');
    const[lname, setLname] = useState('');
    const[username, setUsername] = useState('');
    const[email, setEmail] = useState('');
    const[oldPassword, setOldPassword] = useState('');
    const[newPassword, setNewPassword] = useState('');
    const[confirmNewPassword, setConfirmNewPassword] = useState('');

    const [errorUsernameMessage, setErrorUsernameMessage] = useState('');
    const [errorEmailMessage, setErrorEmailMessage] = useState('');
    const [errorOldPasswordMessage, setErrorOldPasswordMessage] = useState('');
    const [errorNewPasswordMessage, setErrorNewPasswordMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const handleFnameChange = (e) => setFname(e.target.value);
    const handleLnameChange = (e) => setLname(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmNewPasswordChange = (e) => setConfirmNewPassword(e.target.value);
    

    const [profilePicture, setProfilePicture] = useState(
        "https://via.placeholder.com/100" // Default profile picture
    );

    const handleChangePicture = () => {
        // Logic to change picture
        alert("Change picture functionality");
    };

    const handleRemovePicture = () => {
        setProfilePicture("https://via.placeholder.com/100"); // Reset to default
    };


    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const handleEditProfile = () => setIsEditingProfile(true);
    const handleEditPassword = () => setIsEditingPassword(true);

    const handleCancelProfileEdit = () => setIsEditingProfile(false);
    const handleCancelPasswordEdit = () => {
        setIsEditingPassword(false)

        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrorNewPasswordMessage("");
        setErrorOldPasswordMessage("");
    };


    // checking requirement in password
    const isPasswordRequirementMet = (requirement) => {
        switch (requirement) {
        case 'Be 8-100 characters long':
            return newPassword.length >= 8 && newPassword.length <= 100;
        case 'Contain at least one uppercase and one lowercase letter':
            return /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
        case 'Contain at least one number or special character':
            return /\d/.test(newPassword) || /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        default:
            return false;
        }
    };


    const handleSaveUserProfile = (e) => {
        e.preventDefault();
        // Add your logic for saving the user profile
        console.log("Saving user profile:", { fname, lname, username, email });
        setIsEditingProfile(false);
    };

    const handleSavePassword = (e) => {
        e.preventDefault();
        // Add your logic for saving the password
   

        if (!isPasswordRequirementMet('Be 8-100 characters long') ||
            !isPasswordRequirementMet('Contain at least one uppercase and one lowercase letter') ||
            !isPasswordRequirementMet('Contain at least one number or special character')) {
            
            setErrorNewPasswordMessage('Password does not meet the requirements');
            setLoading(false);
            return;
            }

        if (newPassword !== confirmNewPassword) {
            setErrorNewPasswordMessage('Passwords do not match');
            setLoading(false);
            return; 
        }


        console.log("Saving new password:", { oldPassword, newPassword });
        setIsEditingPassword(false);
    };

    
    return(
        <>
            <div className="HomeStudent__main-header">
                <h1>Settings</h1>
            </div>

            <div className="ProfileStudent__profile-container">
                <div className="ProfileStudent__card-header">
                    <h5 className="ProfileStudent__card-header-user fw-bold">User Profile</h5>
                    {!isEditingProfile && (
                        <BiEditAlt
                        className="ProfileStudent__edit-icon"
                        onClick={handleEditProfile}
                        />
                    )}
                </div>
                <form method="post"  onSubmit={handleSaveUserProfile} className="ProfileStudent__card-body">
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
                        value={fname}
                        onChange={handleFnameChange}
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        required
                        />
                    </div>
                    <div className="ProfileStudent__form-group">
                        <label>Last Name</label>
                        <input
                        type="text"
                        value={lname}
                        onChange={handleLnameChange}
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        required
                        />
                    </div>
                    <div className="ProfileStudent__form-group">
                        <label>Username</label>
                        <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        required
                        />
                        {errorUsernameMessage && (
                            <span className="ProfileStudent__error-user-pass-message">
                                {errorUsernameMessage}
                            </span>
                        )}
                    </div>
                    <div className="ProfileStudent__form-group">
                        <label>Email Address</label>
                        <input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={!isEditingProfile}
                        className="ProfileStudent__input"
                        required
                        />
                        {errorEmailMessage && (
                            <span className="ProfileStudent__error-user-pass-message">
                                {errorEmailMessage}
                            </span>
                        )}
                    </div>
                    <div className="ProfileStudent__actions">
                        {isEditingProfile && (
                            <ButtonGroup
                            onCancel={handleCancelProfileEdit}
                            saveText="Save Changes"
                            saveButtonColor="#67A292"
                            />
                        )}
                    </div>
                </form>
            </div>

            <div className="ProfileStudent__profile-container">
                <div className="ProfileStudent__card-header">
                    <h5 className="ProfileStudent__card-header-user fw-bold">Change Password</h5>
                    <BiEditAlt className="ProfileStudent__edit-icon" onClick={handleEditPassword}/>
                </div>
                <form method="post" onSubmit={handleSavePassword} className="ProfileStudent__card-body">
                    {!isEditingPassword ? (
                        <div className="ProfileStudent__form-group">
                            <label>Password</label>
                            <input
                            type="password"
                            value="QWERTY123"
                            disabled
                            className="ProfileStudent__input"
                            />
                        </div>
                        ) : (
                        <div>
                            <div className="ProfileStudent__form-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="ProfileStudent__input"
                                required
                            />
                            {errorOldPasswordMessage && (
                                <span className="ProfileStudent__error-user-pass-message">
                                {errorOldPasswordMessage}
                                </span>
                            )}
                            </div>
                            <div className="ProfileStudent__form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="ProfileStudent__input"
                                required
                            />
                            {errorNewPasswordMessage && (
                                <span className="ProfileStudent__error-user-pass-message">
                                {errorNewPasswordMessage}
                                </span>
                            )}
                            </div>
                            <div className="ProfileStudent__form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="ProfileStudent__input"
                                required
                            />
                            </div>
                            <div className="update-password-instruction">
                            <PasswordRequirements newPassword={newPassword} />
                            </div>
                            <div className="ProfileStudent__actions">
                            <ButtonGroup
                                onCancel={handleCancelPasswordEdit}
                                saveText="Save Changes"
                                saveButtonColor="#67A292"
                            />
                            </div>
                        </div>
                    )}
                </form>
            </div>

        </>
    );
};