import { memo, useRef, useState } from "react"
import { Button } from 'primereact/button'

const InputFile = ({ onChange, label = "Upload file", className, nameField, setFormData }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const formData = new FormData();
            formData.append(nameField || 'file', file);
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

    const handleRemoveFile = () => {
        setSelectedFile(null);
        fileInputRef.current.value = '';
        if (setFormData) {
            setFormData(prev => ({
                ...prev,
                [nameField || 'file']: null
            }));
        }
        if (onChange) {
            onChange(null);
        }
    }

    return (
        <div className={`flex flex-column gap-2 ${className}`}>           
            <div className="flex align-items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <Button
                    onClick={() => fileInputRef.current.click()}
                    severity="info"
                    icon="pi pi-upload"
                    label="Chọn file"
                />
                {selectedFile && (
                    <span className="ml-5 flex align-items-center gap-2">
                       
                        <span className="text-base">{selectedFile.name}</span>
                        <Button
                            onClick={handleRemoveFile}
                            severity="danger"
                            icon="pi pi-trash"
                            label="Xóa file"
                        />
                    </span>
                )}
            </div>
        </div>
    )
}

export default memo(InputFile)