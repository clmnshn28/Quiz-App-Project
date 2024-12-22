import React, {useState, useEffect} from "react";
import 'assets/css/layouts';
import * as images from 'assets/images';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

import { GrHomeRounded } from "react-icons/gr";
import { TbLogout2, TbSettings } from "react-icons/tb";
import { LogoutModal } from "./modals/LogoutModal";


export const StudentLayout = () =>{

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const { signOut } = useAuth(); 
    
    const location = useLocation();
    const [highlightedTab, setHighlightedTab] = useState('');

    useEffect(() => {
        const currentPath = location.pathname;
        
            if (currentPath.includes('home')) {
                setHighlightedTab('home');
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