import React, {useState, useEffect} from "react";
import 'assets/css/student';

import { FiLogIn } from "react-icons/fi";
import { JoinClassModal } from "./modals/JoinClassModal";

export const HomeStudent = () =>{

    const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);

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

            const copyButton = card.querySelector('.DashboardTeacher__copy-code');
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


    const handleConfirmJoin = () =>{
        
    }

    return(
        <>
            <div className="HomeStudent__main-header">
                <div>
                    <h1>Welcome Back,<span> Student</span>!</h1>
                    <p className="HomeStudent__date-time ">
                        {getFormattedDate()}
                    </p>
                </div>
                <div className="HomeStudent__main-header-search">
                    <button className="HomeStudent__join-class" onClick={() => setIsJoinClassModalOpen(true)}>
                        Join a Class
                    </button>
                </div>
            </div>

            {/* Your Classes  */}
            <h2 className="HomeStudent__your-classes">Your Classes</h2>
            <div className="HomeStudent__card-container">
                
                {/* Class Cards */}
                <div className="class-card">
                    <p className="card-title">Elective 5</p>
                    <p className="card-instructor">Instructor: Gabriel M. Galang</p>
                    <button className="card-start">
                        <FiLogIn className="HomeStudent__join-icon"/> 
                    </button>
                </div>

                <div className="class-card">
                    <p className="card-title">Java Programming</p>
                    <p className="card-instructor">Instructor: Jet Li</p>
                    <button className="card-start">
                        <FiLogIn className="HomeStudent__join-icon"/> 
                    </button>
                </div>
                <div className="class-card">
                    <p className="card-title">Game Development</p>
                    <p className="card-instructor">Instructor: Eren Yeager</p>
                    <button className="card-start">
                        <FiLogIn className="HomeStudent__join-icon"/> 
                    </button>
                </div>
            </div>

            <JoinClassModal
                isOpen={isJoinClassModalOpen}
                onClose={() => setIsJoinClassModalOpen(false)}
                onConfirm={handleConfirmJoin}
            />

        </>
    );
};