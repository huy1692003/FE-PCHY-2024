import React, { useState, useEffect } from "react";
import { Panel } from "primereact/panel";

export const CustomPanel = ({ header, fields, formData, currentStep, children , stepPanel }) => {
  const [isCompleted, setIsCompleted] = useState(false); 
  useEffect(() => {
    if (formData?.crr_step >= stepPanel) {
      setIsCompleted(true);
    } else {
      setIsCompleted(fields && formData && fields.every(field => formData[field]));
    }
  }, [fields, formData, currentStep]);

  //console.log('formData in CustomPanel:', formData);

  return (
    <Panel
      header={header}
      toggleable
      collapsed={true}
      className={`my-panel ${isCompleted ? "completed" : "incomplete"} mt-4`}
       // Thay icon mặc định bằng icon tùy chỉnh
    >
      {children}
    </Panel>
  );
};
