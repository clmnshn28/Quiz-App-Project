import React, { useState, useEffect } from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import { TbCopy } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

export const InviteStudentModal = ({ isOpen, onClose, classId }) => {
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJoinCode = async () => {
            if (!isOpen) return;
            
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`https://apiquizapp.pythonanywhere.com/api/classes/${classId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch class data');
                }

                const classData = await response.json();
                setJoinCode(classData.join_code);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchJoinCode();
    }, [isOpen, classId]);

    if (!isOpen) return null;

    return (
        <Modal>
            <div className="InviteStudentModal__content">
                <span className="InviteStudentModal__close" onClick={onClose}><IoClose/></span>
                <div className="InviteStudentModal__title-container">
                    <h5 className="InviteStudentModal__title">Invite Students</h5>
                    <p className="InviteStudentModal__sub-desc">Share this code to the students to give them access.</p>
                </div>
                <div className="InviteStudentModal__input-container">
                    <label className="InviteStudentModal__input-label">Invite Code</label>
                    <div className="InviteStudentModal__input-wrapper">
                        {loading ? (
                            <input 
                                type="text"
                                value="Loading..."
                                readOnly
                                className="InviteStudentModal__input"
                            />
                        ) : error ? (
                            <input 
                                type="text"
                                value="Error loading code"
                                readOnly
                                className="InviteStudentModal__input"
                            />
                        ) : (
                            <>
                                <input 
                                    type="text"
                                    value={joinCode}
                                    readOnly
                                    className="InviteStudentModal__input"
                                />
                                <button 
                                    className="InviteStudentModal__copy-button"
                                    onClick={() => navigator.clipboard.writeText(joinCode)}
                                >
                                    <TbCopy className="InviteStudentModal__copy-button-icon"/>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};