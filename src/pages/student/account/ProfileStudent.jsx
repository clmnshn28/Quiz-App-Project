import React, {useState, useEffect} from "react";
import 'assets/css/student';
import PasswordRequirements from 'components/PasswordRequirements';
import ButtonGroup from 'components/ButtonGroup';
import * as images from 'assets/images';

import { BiEditAlt } from "react-icons/bi";
import { SuccessMessageModal } from "./modals";

export const ProfileStudent = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [errorUsernameMessage, setErrorUsernameMessage] = useState('');
    const [errorEmailMessage, setErrorEmailMessage] = useState('');
    const [errorOldPasswordMessage, setErrorOldPasswordMessage] = useState('');
    const [errorNewPasswordMessage, setErrorNewPasswordMessage] = useState('');
      
    const [successMessageModal, setSuccessMessageModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [profilePicture, setProfilePicture] = useState(images.defaultAvatar);
    const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);
    const [shouldRemovePicture, setShouldRemovePicture] = useState(false);

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/users/profile/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setFname(userData.first_name || '');
                setLname(userData.last_name || '');
                setUsername(userData.username || '');
                setEmail(userData.email || '');
                
                // Update profile picture with default fallback
                const pictureUrl = userData.profile_picture || 'https://apiquizapp.pythonanywhere.com/media/profile_pictures/profile.png';
                setProfilePicture(pictureUrl);
                
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleSaveUserProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorUsernameMessage('');
        setErrorEmailMessage('');
        setSuccessMessage('');

        try {
            const accessToken = localStorage.getItem('accessToken');
            const formData = new FormData();
            
            formData.append('first_name', fname);
            formData.append('last_name', lname);
            formData.append('username', username);
            formData.append('email', email);

            // Handle profile picture changes
            if (shouldRemovePicture) {
                formData.append('remove_profile_picture', 'true');
            } else if (newProfilePictureFile) {
                formData.append('profile_picture', newProfilePictureFile);
            }

            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/users/update_profile/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Profile updated successfully.');
                setSuccessMessageModal(true);

                setIsEditingProfile(false);
                
                // Update profile picture based on response
                const newPictureUrl = data.profile_picture || 'https://apiquizapp.pythonanywhere.com/media/profile_pictures/profile.png';
                setProfilePicture(newPictureUrl);
                
                // Reset picture-related states
                setNewProfilePictureFile(null);
                setShouldRemovePicture(false);

                // Update localStorage
                const updatedUserData = {
                    ...JSON.parse(localStorage.getItem('user') || '{}'),
                    ...data
                };
                localStorage.setItem('user', JSON.stringify(updatedUserData));

            } else {
                if (data.username) setErrorUsernameMessage(data.username[0]);
                if (data.email) setErrorEmailMessage(data.email[0]);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePicture = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setShouldRemovePicture(false);
        setNewProfilePictureFile(file);
        
        // Create a temporary URL for preview
        const tempUrl = URL.createObjectURL(file);
        setProfilePicture(tempUrl);
    };

    const handleRemovePicture = () => {
        setShouldRemovePicture(true);
        setNewProfilePictureFile(null);
        setProfilePicture('https://apiquizapp.pythonanywhere.com/media/profile_pictures/profile.png');
    };

    const handleCancelProfileEdit = () => {
        setIsEditingProfile(false);
        // Reset to the current profile from the server
        fetchUserProfile();
        setShouldRemovePicture(false);
        setNewProfilePictureFile(null);
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorOldPasswordMessage('');
        setErrorNewPasswordMessage('');
        setSuccessMessage('');
    
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
    
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/users/change_password/', {
                method: 'POST',
                headers: {  
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSuccessMessageModal(true);
                setSuccessMessage('Password updated successfully.');

                setIsEditingPassword(false);
                handleCancelPasswordEdit();
            } else {
                if (data.old_password) setErrorOldPasswordMessage(data.old_password[0]);
                if (data.new_password) setErrorNewPasswordMessage(data.new_password[0]);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setErrorNewPasswordMessage('An error occurred while updating the password');
        } finally {
            setLoading(false);
        }
    };

    // ... rest of your existing handlers and UI code remains the same ...
    const handleFnameChange = (e) => setFname(e.target.value);
    const handleLnameChange = (e) => setLname(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleEditProfile = () => {
        setIsEditingProfile(true);
        setTempProfilePicture(profilePicture);
        setShouldRemovePicture(false);
        setNewProfilePictureFile(null);
    };

    const handleEditPassword = () => setIsEditingPassword(true);

    const handleCancelPasswordEdit = () => {
        setIsEditingPassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrorNewPasswordMessage("");
        setErrorOldPasswordMessage("");
    };

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

    return(
        <>
            <div className="HomeStudent__main-header">
                <h1>Settings</h1>
            </div>
            {successMessage && (
                <div className="ProfileStudent__success-message">
                    {successMessage}
                </div>
            )}
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
                        {isEditingProfile && (
                            <div className="ProfileStudent__picture-buttons">
                                <label className="ProfileStudent__button change">
                                    Change picture
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleChangePicture}
                                    />
                                </label>

                                <button
                                    type="button"
                                    className="ProfileStudent__button remove"
                                    onClick={handleRemovePicture}
                                >
                                    Remove picture
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="ProfileStudent__form-group">
                        <label>First Name</label>
                        <input
                        type="text"
                        value={fname || "-"}
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
                        value={lname || "-"}
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
                        value={username || "-"}
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
                        value={email || "-"}
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
                    {!isEditingPassword && (
                        <BiEditAlt 
                            className="ProfileStudent__edit-icon" 
                            onClick={handleEditPassword}
                        />
                    )}
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
            <SuccessMessageModal
                isOpen={successMessageModal}
                onClose={()=>setSuccessMessageModal(false)}
                successMessage={successMessage}
            />
        </>
    );
};