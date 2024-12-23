import React, {useState, useEffect} from "react";
import 'assets/css/student';
import { FiLogIn } from "react-icons/fi";
import { TbCopy } from "react-icons/tb";
import { CreateClassModal } from "./modals/CreateClassModal";
import { SuccessMessageModal } from "./modals";

export const HomeTeacher = () => {
    const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
    const [fname, setFname] = useState('');
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);

    const [successMessageModal, setSuccessMessageModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // fetch first name and classes
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
                setFname(userData.first_name || 'Teacher');
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

    const handleConfirmCreate = async ({ className, section }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('https://apiquizapp.pythonanywhere.com/api/classes/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${className} ${section}`.trim(),
                    join_code: generateJoinCode()  // The backend will handle this if empty
                })
            });

            if (response.ok) {
                const newClass = await response.json();
                setClasses(prevClasses => [newClass, ...prevClasses]);
                setIsCreateClassModalOpen(false);
                setError(null);

                setSuccessMessage("Class successfully created!"); 
                setSuccessMessageModal(true);
                
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create class');
            }
        } catch (error) {
            console.error('Error creating class:', error);
            setError('Failed to create class. Please try again.');
        }
    };

    const generateJoinCode = () => {
        // Generate a random 8-character string (optional - backend can handle this)
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const handleCopyCode = async (joinCode, classId) => {
        try {
            await navigator.clipboard.writeText(joinCode);

            // Set the copied class's tooltip text
            const tooltipElement = document.querySelector(`#copy-button-${classId}`);
            if (tooltipElement) {
                tooltipElement.setAttribute("data-tooltip", "Copied!");
                setTimeout(() => tooltipElement.setAttribute("data-tooltip", "Copy Code"), 1000);
            }
        } catch (err) {
            console.error('Failed to copy join code:', err);
        }
    };

    // class card color 
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

    return(
        <>
            <div className="HomeStudent__main-header">
                <div>
                    <h1>Welcome Back, <span>{fname || 'Teacher'}</span>!</h1>
                    <p className="HomeStudent__date-time">
                        {getFormattedDate()}
                    </p>
                </div>
                <div className="HomeStudent__main-header-search">
                    <button className="HomeStudent__join-class" onClick={() => setIsCreateClassModalOpen(true)}>
                        Create a Class
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <h2 className="HomeStudent__your-classes">Your Classes</h2>
            <div className="HomeStudent__card-container">
                {classes.length === 0 ? (
                    <p className="HomeStudent__no-available">You haven't created any classes yet.</p>
                ) : (
                    classes.map((classItem, index) =>  {
                        const colors = getColorForClass(classItem.id);
                        return (
                            <div 
                            key={classItem.id} 
                            className="class-card"
                            style={{ backgroundColor: colors.cardColor,   '--card-bg-color': colors.cardColor, }}
                            >
                                <button 
                                    id={`copy-button-${classItem.id}`}
                                    data-tooltip="Copy Code" 
                                    style={{ backgroundColor: colors.copyColor }}
                                    className="HomeTeacher__copy-code card-copy"
                                    onClick={() => handleCopyCode(classItem.join_code, classItem.id)}
                                >
                                    <TbCopy className="class-card-copy-code"/>
                                </button>
                                <p className="card-title">{classItem.name}</p>
                                <p className="card-instructor"> BSIT 4E-G1</p>
                                <p className="card-number-student"> {`${classItem.students?.length || 0} ${classItem.students?.length <= 1 ? 'student' : 'students'}`}</p>
                                <button 
                                    className="card-start"
                                    style={{ backgroundColor: colors.startColor }}
                                >
                                    <FiLogIn className="HomeStudent__join-icon"/> 
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <CreateClassModal
                isOpen={isCreateClassModalOpen}
                onClose={() => setIsCreateClassModalOpen(false)}
                onConfirm={handleConfirmCreate}
            />
            <SuccessMessageModal
                isOpen={successMessageModal}
                onClose={()=>setSuccessMessageModal(false)}
                successMessage={successMessage}
            />
        </>
    );
};