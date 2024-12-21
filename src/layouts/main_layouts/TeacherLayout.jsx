import React, {useState, useEffect} from "react";
import 'assets/css/layouts';
import * as images from 'assets/images';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { GrHomeRounded } from "react-icons/gr";
import { TbLogout2, TbSettings } from "react-icons/tb";
import { GrDocument } from "react-icons/gr";

export const TeacherLayout = () =>{


    const location = useLocation();
    const [highlightedTab, setHighlightedTab] = useState('');

    useEffect(() => {
        const currentPath = location.pathname;
        
            if (currentPath.includes('home')) {
                setHighlightedTab('home');
            } else if (currentPath.includes('quiz')) {
                setHighlightedTab('quiz');
            } else if (currentPath.includes('settings')) {
                setHighlightedTab('settings');
            }
            
        }, [location]);

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
                    <Link to="quiz" className={`link-sidebar ${highlightedTab === 'quiz'? 'highlighted' : ''}`}>
                        <li>
                            <GrDocument className={`StudentLayout__sidebar-icon ${highlightedTab === 'quiz'? 'active' : ''} `}/>
                            <span className="sidebar-text">Quizzes</span>
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
                    <Link to="logout" className={`link-sidebar ${highlightedTab === 'a'? 'highlighted' : ''}`}>
                        <li>
                            <TbLogout2 className={`StudentLayout__sidebar-icon ${highlightedTab === 'a'? 'active' : ''} `}/>
                            <span className="sidebar-text">Logout</span>
                        </li>
                    </Link>
                </div>
            </div>
 
            {/* main content */}
            <div className="StudentLayout__main-content-layout">
                <Outlet/>
            </div>
        </div>
    );
};