import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

// Component dùng chung
const FileViewer = ({ url }) => {
    // Lấy extension từ đường dẫn
    const getFileType = (path) => path.split('.').pop().toLowerCase();

    // Kiểm tra loại file
    const fileType = getFileType(url);

    // Danh sách tài liệu cho DocViewer
    const docs = [{ uri: url }];

    return (
        <div style={{ height: "100vh" }}>
            {["pdf", "docx", "doc", "pptx", "xlsx"].includes(fileType) ? (
                <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
            ) : (
                <div className="text-lg font-bold text-red-500">Loại file không được hỗ trợ: {fileType}</div>
            )}
        </div>
    );
};

export default FileViewer;
