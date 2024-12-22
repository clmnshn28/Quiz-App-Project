import React, {useState, useEffect} from "react";
import 'assets/css/student';

import { FiLogIn } from "react-icons/fi";
import { TbCopy } from "react-icons/tb";
import { CreateClassModal } from "./modals/CreateClassModal";

export const HomeTeacher = () =>{

    const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
    const [fname, setFname] = useState('');

    // fetch first name
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
                setFname(userData.first_name || 'Teacher');
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // class card color 
    const colorCombinations = [
        { cardColor: '#DDE9E6', copyColor: '#A7CDC3', startColor: '#67A292' },
        { cardColor: '#E9DDDD', copyColor: '#CDA7A7', startColor: '#A26768' },
        { cardColor: '#DDE9E9', copyColor: '#A7B7CD', startColor: '#677CA2' }
    ];

    useEffect(() => {
        const classCards = document.querySelectorAll('.class-card');

        classCards.forEach((card, index) => {
            const { cardColor, copyColor, startColor } = colorCombinations[index % colorCombinations.length];
            
            card.style.backgroundColor = cardColor;
            card.style.setProperty('--card-bg-color', cardColor);

            const copyButton = card.querySelector('.HomeTeacher__copy-code');
            if (copyButton) {
                copyButton.style.backgroundColor = copyColor;
            }

            const startButton = card.querySelector('.card-start');
            if (startButton) {
                startButton.style.backgroundColor = startColor;
            }
        });
    }, []); 

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

        return `It’s ${dayName}, ${day} ${month} ${year}`;
    };


    const handleConfirmCreate = async ({ className, section }) => {
        
    }


    return(
        <>
            <div className="HomeStudent__main-header">
                <div>
                    <h1>Welcome Back, <span>{fname || 'Teacher'}</span>!</h1>
                    <p className="HomeStudent__date-time ">
                        {getFormattedDate()}
                    </p>
                </div>
                <div className="HomeStudent__main-header-search">
                    <button className="HomeStudent__join-class" onClick={() => setIsCreateClassModalOpen(true)}>
                        Create a Class
                    </button>
                </div>
            </div>

            {/* Your Classes  */}
            <h2 className="HomeStudent__your-classes">Your Classes</h2>
            <div className="HomeStudent__card-container">
                
                {/* Class Cards */}
                <div className="class-card">
                    <button className="HomeTeacher__copy-code card-copy">
                        <TbCopy className="class-card-copy-code"/>
                    </button>
                    <p className="card-title">Elective 5</p>
                    <p className="card-instructor">BSIT 4E-G1</p>
                    <button className="card-start">
                        <FiLogIn className="HomeStudent__join-icon"/> 
                    </button>
                </div>

                <div className="class-card">
                    <button className="HomeTeacher__copy-code card-copy">
                        <TbCopy className="class-card-copy-code"/>
                    </button>
                    <p className="card-title">Java Programming</p>
                    <p className="card-instructor">BSIT 3E-G1</p>
                    <button className="card-start">
                        <FiLogIn className="HomeStudent__join-icon"/> 
                    </button>
                </div>
                <div className="class-card">
                    <button className="HomeTeacher__copy-code card-copy">
                        <TbCopy className="class-card-copy-code"/>
                    </button>
                    <p className="card-title">Game Development</p>
                    <p className="card-instructor">BSIT 3E-G1</p>
                    <button className="card-start">
                        <FiLogIn className="HomeStudent__join-icon"/> 
                    </button>
                </div>
            </div>

            <CreateClassModal
                isOpen={isCreateClassModalOpen}
                onClose={() => setIsCreateClassModalOpen(false)}
                onConfirm={handleConfirmCreate}
            />

        </>
    );
};