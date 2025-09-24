import { useContext, useState } from "react"
import DashbardLayout from "../layout/DashbardLayout"
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { AlertCircle } from "lucide-react";
import UploadBox from "../components/UploadBox";
import axios from "axios";
import { apiEndpoints } from "../utils/ApiEndpoints";

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success or error
    const { getToken } = useAuth();
    const { credits, setCredits } = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    const handleFileChange = (selectedFiles) => {
        if (files.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType('error');
            return;
        }
        // add new files in to exisiting files
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    }

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessageType("");
        setMessage("");
    }

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessageType('error');
            setMessage('Please select at least one file to upload');
            return;
        }
        if (files.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType('error');
            return;
        }
        setUploading(true);
        setMessage('Uploading files...');
        setMessageType('info');

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        
        try {
            const token = await getToken();
            const response = await axios.post(apiEndpoints.UPLOAD_FILES, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data && response.data.remainingCredits !== undefined) {
                setCredits(response.data.remainingCredits);
            }
            setMessage('Files uploaded successfully');
            setMessageType('success');
            setFiles([]);
        } catch (error) {
            console.error('Error uploading files', error);
            setMessage(error.response?.data?.message || 'Error uploading files. Please try again.');
            setMessageType('error');
        } finally {
            setUploading(false);
        }
    }

    const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits <= 0 || files.length > credits;

    return (
        <DashbardLayout activeMenu={"Upload"}>
            <div className="p-6">
                {
                    message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700' : messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                            {
                                messageType === 'error' && <AlertCircle size={20} />
                            }
                            {message}
                        </div>
                    )
                }

                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />
            </div>
        </DashbardLayout>
    )
}

export default Upload