import React,{useState, useEffect} from "react";
import 'assets/css/landing';
import * as images from 'assets/images';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

    const goToSignIn = () => {
        navigate("/sign-in");
    };

    const goToSignUp = () => {
        navigate("/sign-up");
    };

    return(
        <div className="LandingPage__content">
            <header >
                <img className="LandingPage__logo" src={images.loginLogo} alt="LOGO"/>
                <nav>
                    <a href="#home">Home</a>
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact</a>
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
                <section className="LandingPage__about-us">
                    
                </section>
            </main>
            <footer>          
                <p className="footer__copyright">Copyright © Neager Group 2025</p>
            </footer>
        </div>
    );
};