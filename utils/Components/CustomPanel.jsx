import React, { useState, useEffect } from "react";
import { Panel } from "primereact/panel";

export const CustomPanel = ({ header, fields, formData, currentStep, children , stepPanel }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const SP_THINGHIEM = 3;
  // useEffect(() => {
  //   if (fields && formData) {
  //     const completed = fields.every((field) => {
      
  //       return formData[field] !== null && formData[field] !== "" && formData[field] !== undefined;
  //     });
  //     setIsCompleted(completed);
  //   }
  // }, [fields, formData]);
  console.log(formData)
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
    >
      {children}
    </Panel>
  );
};
