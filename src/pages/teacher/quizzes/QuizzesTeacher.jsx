import React, {useState, useEffect} from "react";
import 'assets/css/teacher';


export const QuizzesTeacher = () => {


    return(
        <>
            <div className="HomeStudent__main-header">
                <div>
                    <h1>Create a New Quiz</h1>
                </div>
                <div className="HomeStudent__main-header-search">
                    <button className="HomeStudent__join-class" onClick={() => setIsCreateClassModalOpen(true)}>
                        Create a Class
                    </button>
                </div>
            </div>

            <h2 className="HomeStudent__your-classes">Questions</h2>
            <div className="QuizzesTeacher__questions-container">
                
            </div>
        </>
    );
};