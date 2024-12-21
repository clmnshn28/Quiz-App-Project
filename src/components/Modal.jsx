import React from 'react';
import'assets/css/layouts';

export default function Modal({children, onClick}){
 return(
  <div className="Modal__overlay" onClick={onClick}>
    {children}
  </div>
 );
};