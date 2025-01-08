// LoadingOverlay.js
import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primeflex/primeflex.css'; // Import PrimeFlex

const LoadingOverlay = ({ isLoading , title}) => {
  if (!isLoading) return null; // Nếu không loading thì không hiển thị gì

  return (
    <div
      className="flex justify-content-center align-items-center fixed top-0 left-0 w-full h-full"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}
    >
      <div
        className="flex  align-items-center justify-content-center p-5 border-round"
        style={{ backgroundColor: 'white', width:500 }}
      >
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        <span className='text-xl' style={{ marginLeft: '10px', fontSize: '16px', color: '#333' }}>{title}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
