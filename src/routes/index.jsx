import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import { LandingPage } from 'pages/landing';

import {SignIn, SignUp} from 'pages/auth';
import { StudentLayout, TeacherLayout } from 'layouts/main_layouts';

import { HomeStudent, EnterClassStudent } from 'pages/student/home';
import { ProfileStudent } from 'pages/student/account';
import { TakeQuiz } from 'pages/student/home';
import { QuizResult } from 'pages/student/home';

import { HomeTeacher, EnterClassTeacher } from 'pages/teacher/home';
import { QuizzesTeacher } from 'pages/teacher/quizzes';
import { QuizBankTeacher } from 'pages/teacher/quiz-bank';
import { ProfileTeacher } from 'pages/teacher/account';

const MainRoutes = () =>{

    return(
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} /> 
                <Route path="/sign-in" element={<SignIn />} /> 
                <Route path="/sign-up" element={<SignUp />} /> 

                <Route path="/student" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <StudentLayout/>
                    </PrivateRoute>
                }>
                    <Route path="home" element={<HomeStudent />} /> 
                    <Route path="home/class/:classId" element={<EnterClassStudent />} />
                    <Route path="home/class/:classId/quiz/:quizId" element={<TakeQuiz />} />
                    <Route path="home/class/:classId/quiz/:quizId/results" element={<QuizResult />} />
                    <Route path="settings" element={<ProfileStudent />} />
                </Route>

                <Route path="/teacher" element={
                    <PrivateRoute allowedRoles={['teacher']}>
                      <TeacherLayout />
                    </PrivateRoute>
                }>
                    <Route path="home" element={<HomeTeacher />} />
                    <Route path="home/class/:classId" element={<EnterClassTeacher />} />
                    <Route path="quizzes" element={<QuizzesTeacher />} /> 
                    <Route path="question-bank" element={<QuizBankTeacher />} />  
                    <Route path="settings" element={<ProfileTeacher />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default MainRoutes;