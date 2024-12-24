import React,{useState, useEffect} from "react";
import 'assets/css/landing';
import * as images from 'assets/images';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { IoDocumentTextOutline } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { LuLink } from "react-icons/lu";
import { IoChatbubblesOutline } from "react-icons/io5";
import { PiMedal } from "react-icons/pi";
export const LandingPage = () =>{

    const navigate = useNavigate();
    const[mousePosition, setMousePosition] = useState({x:0, y:0});
    const [isAnimating, setIsAnimating] = useState(false);

    const updateMousePosition = (e) =>{
        setMousePosition({x: e.clientX, y: e.clientY});
        setIsAnimating(true);
    };

    useEffect( () =>{
        window.addEventListener("mousemove", updateMousePosition)
        return () =>{
            window.removeEventListener("mousemove", updateMousePosition)
        }
    },[]);

    const [autoHover, setAutoHover] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setAutoHover((prev) => !prev);  
        }, 4000);  

        return () => {
            clearInterval(intervalId);  
        };
    }, []);

    const [state, setState] = useState(0); // 0: Teacher Not Hovered, 1: Teacher Hovered, 2: Student Not Hovered, 3: Student Hovered

    // List of Teacher and Student Side content
    const content = {
        teacher: [
            { icon: <IoDocumentTextOutline className="LandingPage__overview-list-icon" />, text: "Create and manage quizzes with multiple question types." },
            { icon: <GiSandsOfTime className="LandingPage__overview-list-icon" />, text: "Schedule quizzes, set timers, and auto-grade." },
            { icon: <BsFileEarmarkBarGraph className="LandingPage__overview-list-icon" />, text: "Generate reports and access a question bank for easy quiz creation." }
        ],
        student: [
            { icon: <LuLink className="LandingPage__overview-list-icon" />, text: "Join classes with a simple code." },
            { icon: <PiMedal className="LandingPage__overview-list-icon" />, text: "Take timed quizzes and instantly view scores." },
            { icon: <IoChatbubblesOutline className="LandingPage__overview-list-icon" />, text: "Get feedback on correct and incorrect answers." }
        ]
    };

    // Cycle through the four states
    useEffect(() => {
        const intervalId = setInterval(() => {
            setState((prev) => (prev + 1) % 4); // Cycle between 0, 1, 2, 3
        }, 4000); 

        return () => clearInterval(intervalId);
    }, []);

    const isTeacher = state === 0 || state === 1;
    const isHovered = state === 1 || state === 3;
    const isStudent = state === 2 || state === 3;

    const goToSignIn = () => {
        navigate("/sign-in");
    };

    const goToSignUp = () => {
        navigate("/sign-up");
    };

    return(
        <div  id="home" className="LandingPage__content">
            <header >
                <img className="LandingPage__logo" src={images.loginLogo} alt="LOGO"/>
                <nav>
                    <a href="#home">Home</a>
                    <a href="#overview">Overview</a>
                    <a href="#about">About Us</a>
                    <button onClick={goToSignIn} className="LandingPage__sign-in-btn mob">Log In</button>
                    <button onClick={goToSignUp} className="LandingPage__sign-up-btn">Sign Up</button>
                </nav>
            </header>
            <main>
                <section className="LandingPage__hero">
                    <div className="LandingPage__phrase-container">
                    <p className={`LandingPage__sub-phrase ${isAnimating ? 'no-shadow' : ''}`}>Quick to Play, Quick to Slay!</p>
                        <h1>Test Your Brain, Break the Chain!</h1>
                        <motion.div 
                        className="LandingPage__mask"
                        animate={{
                            WebkitMaskPosition:`${mousePosition.x - 190}px ${mousePosition.y - 215}px`,
                        }}
                        transition={{
                            type: "tween", 
                            ease: "backOut"
                        }}
                        >
                            <p className="LandingPage__sub-phrase">Quick to Play, Quick to Slay!</p>
                            <h1>Test Your Brain, Break the Chain!</h1>
                        </motion.div>
                    </div>
                    <img className="LandingPage__hero-icon" src={images.landingCover} alt="LOGO"/>
                </section>

                {/* section 2 */}
                <section id="overview" className="LandingPage__overview">
                    <div className="LandingPage__overview-left">
                        <h3>Welcome to Quiz IT</h3>
                        <p>
                        Quiz IT is an intuitive quiz platform designed to simplify quiz creation, participation, and grading for both teachers and students. Powered by Python Django, it offers a seamless experience for creating engaging quizzes and tracking progress efficiently.
                        </p>
                    </div>
                    <div className="LandingPage__overview-right">
                        <div className={`LandingPage__overview-card ${autoHover ? 'hovered' : ''}`}>
                        <span className={`span_overview LandingPage__overview-card-content ${isHovered ? "" : "visible"}`}>
                            {isTeacher ? "Teacher Side" : "Student Side"}
                        </span>
                        <ul className={`LandingPage__overview-card-content ${isHovered ? "visible" : ""}`}>
                            {(isTeacher ? content.teacher : content.student).map((item, index) => (
                                <li key={index} className="LandingPage__overview-list-content">
                                    {item.icon}
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        </div>  
                    </div>
                </section>

                {/* section 3 */}
                <section id="about" className="LandingPage__about-us">
                    <div className="LandingPage__about-us-header-container">
                        <h2 className="LandingPage__about-us-header">ABOUT US</h2>
                    </div>
                    <div className="LandingPage__about-us-details-container">
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile1} alt="Profile"/>
                            <p>Mark David L. Basinillo</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.defaultAvatar} alt="Profile"/>
                            <p>Joshua T. Canoza</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile3} alt="Profile"/>
                            <p>Celmin Shane A. Quizon</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile4} alt="Profile"/>
                            <p>Andrea Joy N. Dela Torre</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile5} alt="Profile"/>
                            <p>Adrian James A. Lopez</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile6} alt="Profile"/>
                            <p>Francis Harvey SD. Soriano</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile7} alt="Profile"/>
                            <p>Neil Carlo D. Zapanta</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile8} alt="Profile"/>
                            <p>John Isaac H. Ulang</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile9} alt="Profile"/>
                            <p>Vonn  Samuel P. Arreza</p>
                        </div>
                        <div className="LandingPage__about-us-person">
                            <img src={images.profile10} alt="Profile"/>
                            <p>Angelo Domini E. Sunpongco</p>
                        </div>

                    </div>
                </section>
  
            </main>
            <footer>          
                <p className="footer__copyright">Copyright © Enilegnave 2025</p>
            </footer>
        </div>
    );
};