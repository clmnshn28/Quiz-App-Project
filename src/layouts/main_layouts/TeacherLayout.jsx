import React, {useState, useEffect} from "react";
import 'assets/css/layouts';
import * as images from 'assets/images';
import { LogoutModal } from "./modals/LogoutModal";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

import { GrHomeRounded } from "react-icons/gr";
import { TbLogout2, TbSettings } from "react-icons/tb";
import { GrDocument } from "react-icons/gr";
import { RiFolderChartLine, RiQuestionLine  } from "react-icons/ri";
import { LuFileQuestion } from "react-icons/lu";

export const TeacherLayout = () =>{

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const { signOut } = useAuth(); 

    const location = useLocation();
    const [highlightedTab, setHighlightedTab] = useState('');

    useEffect(() => {
        const currentPath = location.pathname;
        
            if (currentPath.includes('home')) {
                setHighlightedTab('home');
            } else if (currentPath.includes('quizzes')) {
                setHighlightedTab('quizzes');
            } else if (currentPath.includes('question-bank')) {
                setHighlightedTab('question-bank');
            } else if (currentPath.includes('settings')) {
                setHighlightedTab('settings');
            }
            
    }, [location]);

    const handleLogout = () => {
        setIsLogoutModalOpen(false);
        signOut();
        navigate('/sign-in');
        console.log("User logged out");
    };


    return(
        <div className="StudentLayout__container">

            <div className="StudentLayout__sidebar ">
                <img src={images.loginLogo} className="StudentLayout__image-logo" alt="Login Image"/>
                <div  className="StudentLayout__sidebar-content ">
                    <Link to="home" className={`link-sidebar ${highlightedTab === 'home'? 'highlighted' : ''}`}>
                        <li>
                            <GrHomeRounded className={`StudentLayout__sidebar-icon ${highlightedTab === 'home'? 'active' : ''} `}/>
                            <span className="sidebar-text">Home</span>
                        </li>
                    </Link>
                    <Link to="quizzes" className={`link-sidebar ${highlightedTab === 'quizzes'? 'highlighted' : ''}`}>
                        <li>
                            <GrDocument className={`StudentLayout__sidebar-icon ${highlightedTab === 'quizzes'? 'active' : ''} `}/>
                            <span className="sidebar-text">Quizzes</span>
                        </li>
                    </Link>
                    <Link to="question-bank" className={`link-sidebar ${highlightedTab === 'question-bank'? 'highlighted' : ''}`}>
                        <li>
                            <LuFileQuestion className={`StudentLayout__sidebar-icon ${highlightedTab === 'question-bank'? 'active' : ''} `}/>
                            <span className="sidebar-text">Question Bank</span>
                        </li>
                    </Link>
                </div>
                
                <div className="DashboardStudent__sidebar-settings-logout ">
                    <Link to="settings" className={`link-sidebar ${highlightedTab === 'settings'? 'highlighted' : ''}`}>
                        <li>
                            <TbSettings className={`StudentLayout__sidebar-icon ${highlightedTab === 'settings'? 'active' : ''} `}/>
                            <span className="sidebar-text">Settings</span>
                        </li>
                    </Link>
                   <div className={`link-sidebar ${highlightedTab === 'a'? 'highlighted' : ''}`} onClick={()=> setIsLogoutModalOpen(true)}>
                        <li>
                            <TbLogout2 className={`StudentLayout__sidebar-icon ${highlightedTab === 'a'? 'active' : ''} `}/>
                            <span className="sidebar-text">Logout</span>
                        </li>
                    </div>
                </div>
            </div>
 
            {/* main content */}
            <div className="StudentLayout__main-content-layout">
                <Outlet/>
            </div>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={()=> setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
};