import { memo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const InputFile = ({ onChange, label = "Upload file", className, nameField, setFormData, showSelectedFile = true, showPreview = false }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const formData = new FormData();
            formData.append("file", file);
            if (setFormData) {
                setFormData((prev) => ({
                    ...prev,
                    [nameField || "file"]: formData,
                }));
            }
            if (onChange) {
                onChange(formData);
            }
        }
    };

    const handlePreview = () => {
        setIsDialogVisible(true);
    };

    const renderPreviewContent = () => {
        if (!selectedFile) return null;

        const fileURL = URL.createObjectURL(selectedFile);

        if (selectedFile.type === "application/pdf") {
            // Hiển thị file PDF bằng <embed>
            return (
                <embed
                    src={fileURL}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                />
            );
        } else if (
            selectedFile.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // DOCX
            selectedFile.type === "application/msword" // DOC
        ) {
            // Hiển thị link mở bằng Google Docs Viewer
            return (
                <iframe
                    src={`https://docs.google.com/viewer?url=${fileURL}&embedded=true`}
                    width="100%"
                    height="500px"
                    title="Preview"
                />
            );
        } else {
            // Hiển thị nút tải xuống nếu không hỗ trợ xem trước
            return (
                <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-link"
                >
                    Nhấn vào đây để tải file
                </a>
            );
        }
    };

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
                        tooltipOptions={{position:"bottom"}}
                        tooltip="Nhấn vào để thay đổi File"
                        onClick={() => fileInputRef.current.click()}
                        severity="info"
                        className="bg-white text-primary"
                        style={{
                            width: "100%",
                            maxHeight: "40px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                        icon={"pi pi-upload"}
                        label={selectedFile ? selectedFile.name : "Chọn file"}
                    />
                </span>
                {selectedFile && showPreview && (
                    <Button
                        tooltip="Xem trước File"
                        onClick={handlePreview}
                        severity="secondary"
                        title="Xem trước File"
                        className="bg-white text-primary mt-2"
                        style={{ maxHeight: "40px" }}
                        icon={"pi pi-eye"}
                        label="Xem trước File"
                    />
                )}
            </div>

            {/* Dialog hiển thị preview */}
            <Dialog
                header="File Preview"
                visible={isDialogVisible}
                style={{ width: "70vw" }}
                onHide={() => setIsDialogVisible(false)}
            >
                {renderPreviewContent()}
            </Dialog>
        </div>
    );
};

export default memo(InputFile);
