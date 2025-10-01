import { ArrowUpFromLine, File, X } from "lucide-react";
import { useRef } from "react";

const UploadBox = ({ files, onFileChange, onUpload, uploading, onRemoveFile, remainingCredits, isUploadDisabled }) => {
    const fileInputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        if (uploading) return;
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0 && onFileChange) {
            onFileChange(droppedFiles);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleFileInput = (e) => {
        if (uploading) return;
        if (onFileChange) onFileChange(Array.from(e.target.files));
        e.target.value = null;
    };

    const handleBoxClick = () => {
        if (!uploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between mb-3">
                <span className={`font-semibold text-lg flex items-center gap-1 cursor-pointer ${uploading ? 'pointer-events-none opacity-[0.5]' : ''}`} onClick={handleBoxClick}>
                    <ArrowUpFromLine className="text-blue-500" size={20} /> Upload Files
                </span>

                <span className="text-gray-500">{remainingCredits} credits remaining</span>
            </div>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleBoxClick}
                className={`border-2 border-dashed rounded-xl bg-white py-10 text-center transition-colors cursor-pointer hover:border-blue-400 ${uploading ? 'pointer-events-none opacity-[0.5]' : ''}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                    disabled={uploading}
                />

                <div className="text-blue-500 mb-2 flex justify-center">
                    <ArrowUpFromLine className="w-11 h-11 bg-blue-100 p-2 rounded-full" />
                </div>

                <div className="font-medium text-gray-700 mb-1">
                    Drag and drop files here
                </div>

                <div className="text-gray-500 text-sm">
                    or click to browse ({remainingCredits} credits remaining)
                </div>
            </div>

            {
                files.length > 0 && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-gray-700 font-semibold mb-3">
                            Selected Files ({files.length})
                        </h3>

                        <ul>
                            {
                                files.map((file, idx) => (
                                    <li key={idx} className="flex items-center justify-between bg-white border-b-2 border-gray-400 px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2">
                                            <File size={24} className="text-blue-500" />

                                            <div className="flex flex-col gap-1">
                                                <span className="text-gray-800 text-sm font-medium truncate">
                                                    {file.name}
                                                </span>

                                                <span className="text-gray-500 text-xs">
                                                    {
                                                        (
                                                            file.size / 1024 < 1024
                                                                ? `${(file.size / 1024).toFixed(2)} KB`
                                                                : `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                                        )
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => onRemoveFile && onRemoveFile(idx)}
                                            disabled={uploading}
                                            className="text-gray-400 hover:text-gray-700 ml-3 disabled:opacity-50 cursor-pointer"
                                            title="Remove"
                                        >
                                            <X size={18} />
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>

                        <button
                            onClick={onUpload}
                            disabled={isUploadDisabled || uploading}
                            className={`mt-4 w-full py-3 rounded-md font-medium text-white text-center cursor-pointer ${isUploadDisabled || uploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default UploadBox;