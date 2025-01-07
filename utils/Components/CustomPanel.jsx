// import React, { useState, useEffect } from "react";
// import { Panel } from "primereact/panel";

// export const CustomPanel = ({ header, fields, formData, stepPanel, children  }) => {
//   const [isDoneStep3, setIsDoneStep3] = useState(false);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const SP_THINGHIEM = 3;
//   useEffect(() => {
//     if (fields && formData) {
//       const completed = fields.every((field) => {
      
//         return formData[field] !== null && formData[field] !== "" && formData[field] !== undefined;
//       });
//       setIsCompleted(completed);

//       if (stepPanel >= SP_THINGHIEM) {
//         setIsDoneStep3(true);
//       }
//     }
//   }, [fields, formData]);
//   // console.log(formData)
//   console.log(stepPanel, isDoneStep3)
//   // useEffect(() => {
//   //   if (formData?.crr_step >= SP_THINGHIEM) {
//   //     setIsCompleted(true);
//   //   } else {
//   //     setIsCompleted(fields && formData && fields.every(field => formData[field]));
//   //   }
//   // }, [fields, formData, currentStep]);

//   //console.log('formData in CustomPanel:', formData);

//   return (
//     <Panel
//       header={header}
//       toggleable
//       collapsed={true}
//       className={`my-panel ${isCompleted ? "completed" : "incomplete"} mt-4`}
//     >
//       {children}
//     </Panel>
//   );
// };

import React, { useState, useEffect } from "react";
import { Panel } from "primereact/panel";

export const CustomPanel = ({ header, fields, formData, currentStep, children }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const SP_THINGHIEM = 3; // Bước 3 là bước thí nghiệm

  useEffect(() => {
    if (formData) {
      // Kiểm tra xem tất cả các trường đã được điền đầy đủ hay chưa (nếu có fields)
      const fieldsCompleted = fields ? fields.every((field) => {
        return formData[field] !== null && formData[field] !== "" && formData[field] !== undefined;
      }) : true; // Nếu không có fields, coi như đã hoàn thành

      // Nếu currentStep >= SP_THINGHIEM, đánh dấu là hoàn thành
      const stepCompleted = currentStep >= SP_THINGHIEM;

      // Kết hợp cả hai điều kiện
      setIsCompleted(fieldsCompleted || stepCompleted);
    }
  }, [fields, formData, currentStep]); // Thêm currentStep vào dependency array

  console.log("currentStep:", currentStep, "isCompleted:", isCompleted);

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