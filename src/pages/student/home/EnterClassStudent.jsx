import React, {useState, useEffect} from "react";
import 'assets/css/student';
import { useParams } from 'react-router-dom';

export const EnterClassStudent = () => {
    const { classId } = useParams();

    return(
        <>
            <nav className="QuizzesTeacher__breadcrumb">
                <span>Home</span>
                <span> &gt; </span>
                <span>Class</span>
            </nav>
        </>
    );
};