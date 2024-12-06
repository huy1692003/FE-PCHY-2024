import { memo, useRef, useState } from "react"
import { Button } from 'primereact/button'

const InputFile = ({ onChange, label = "Upload file", className, nameField, setFormData, showSelectedFile = true }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const formData = new FormData();
            formData.append('file', file);
            if (setFormData) {
                setFormData(prev => ({
                    ...prev,
                    [nameField || 'file']: formData
                }));
            }
            if (onChange) {
                onChange(formData);
            }
        }
    }

    return (
        <div className={`flex flex-column gap-2 ${className}`}>
            <div className="flex flex-column gap-2">
                <span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <Button 
                        tooltip="Nhấn vào để thay đổi File"
                        onClick={() => fileInputRef.current.click()}
                        severity="info"
                        style={{ width: '99%' }}
                        icon={"pi pi-upload"}
                        label={selectedFile ? selectedFile.name : "Chọn file"}
                    />
                </span>
            </div>
        </div>
    )
}

export default memo(InputFile)