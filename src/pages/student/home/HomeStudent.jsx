import React, {useState, useEffect} from "react";
import 'assets/css/student';
import { useNavigate } from 'react-router-dom';

import { FiLogIn } from "react-icons/fi";
import { JoinClassModal } from "./modals/JoinClassModal";
import { SuccessMessageModal } from "./modals";

export const HomeStudent = () => {
    const navigate = useNavigate();

    const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);
    const [fname, setFname] = useState('');
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);

    const [successMessageModal, setSuccessMessageModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUserProfile();
        fetchClasses();
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
                setFname(userData.first_name || 'Student');
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/classes/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.ok) {
                const classesData = await response.json();
                setClasses(classesData.sort((a, b) => b.id - a.id));
            } else {
                console.error('Failed to fetch classes');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleConfirmJoin = async (classCode) => {
        try {
            if (!classCode.trim()) {
                setError('Please enter a class code');
                return;
            }

            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/classes/join/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    join_code: classCode
                })
            });

            if (response.ok) {
                // Refresh the classes list to show the newly joined class
                await fetchClasses();
                setIsJoinClassModalOpen(false);
                setError(null);

                setSuccessMessage('You have successfully joined the class!');
                setSuccessMessageModal(true);  

            } else {
                const errorData = await response.json();
                if (response.status === 404) {
                    setError('Invalid class code. Please check and try again.');
                } else if (response.status === 400) {
                    setError('You are already a member of this class.');
                } else {
                    setError(errorData.error || 'Failed to join class');
                }
            }
        } catch (error) {
            console.error('Error joining class:', error);
            setError('Failed to join class. Please try again.');
        }
    };

    const colorCombinations = [
        { cardColor: '#DDE9E6', copyColor: '#A7CDC3', startColor: '#67A292' },
        { cardColor: '#E9DDDD', copyColor: '#CDA7A7', startColor: '#A26768' },
        { cardColor: '#DDE9E9', copyColor: '#A7B7CD', startColor: '#677CA2' }
    ];

    const getColorForClass = (id) => {
        const index = id % colorCombinations.length;
        return colorCombinations[index];
    };

    const getFormattedDate = () => {
        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const dayName = days[now.getDay()];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        return `It's ${dayName}, ${day} ${month} ${year}`;
    };

    const handleStartClass = (classId) => {
        navigate(`class/${classId}`);
    };

    return(
        <>
            <div className="HomeStudent__main-header">
                <div>
                    <h1>Welcome Back, <span>{fname || 'Student'}</span>!</h1>
                    <p className="HomeStudent__date-time">
                        {getFormattedDate()}
                    </p>
                </div>
                <div className="HomeStudent__main-header-search">
                    <button className="HomeStudent__join-class" onClick={() => setIsJoinClassModalOpen(true)}>
                        Join a Class
                    </button>
                </div>
            </div>

            <h2 className="HomeStudent__your-classes">Your Classes</h2>
            <div className="HomeStudent__card-container">
                {classes.length === 0 ? (
                    <p className="HomeStudent__no-available">You haven't joined any classes yet.</p>
                ) : (
                    classes.map((classItem, index) => {
                        const colors = getColorForClass(classItem.id);
                        return (
                            <div
                                key={classItem.id}
                                className="class-card"
                                style={{ backgroundColor: colors.cardColor }}
                            >
                                <p className="card-title">{classItem.name}</p>
                                <p className="card-instructor">
                                    Instructor: {classItem.teacher?.first_name && classItem.teacher?.last_name
                                        ? `${classItem.teacher.first_name} ${classItem.teacher.last_name}`
                                        : classItem.teacher?.username}
                                </p>
                                <button
                                    className="card-start"
                                    style={{ backgroundColor: colors.startColor }}
                                    onClick={() => handleStartClass(classItem.id)}
                                >
                                    <FiLogIn className="HomeStudent__join-icon" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <JoinClassModal
                isOpen={isJoinClassModalOpen}
                onClose={() => {
                    setIsJoinClassModalOpen(false);
                    setError(null);
                }}
                onConfirm={handleConfirmJoin}
                error={error} 
                setError={setError} 
            />

            <SuccessMessageModal
                isOpen={successMessageModal}
                onClose={()=>setSuccessMessageModal(false)}
                successMessage={successMessage}
            />
        </>
    );
};