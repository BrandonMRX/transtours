import React, { useState, Component, useContext, useEffect, useRef } from "react";

export const useTogglePasswordVisibility2 = () => {
    const [passwordVisibility2, setPasswordVisibility] = useState(true);
    const [rightIcon2, setRightIcon] = useState('eye');
  
    const handlePasswordVisibility2 = () => {
      if (rightIcon2 === 'eye') {
        setRightIcon('eye-slash');
        setPasswordVisibility(!passwordVisibility2);
      } else if (rightIcon2 === 'eye-slash') {
        setRightIcon('eye');
        setPasswordVisibility(!passwordVisibility2);
      }
    };
  
    return {
      passwordVisibility2,
      rightIcon2,
      handlePasswordVisibility2
    };
  };