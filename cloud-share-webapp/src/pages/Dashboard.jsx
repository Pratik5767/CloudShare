import { useAuth } from "@clerk/clerk-react"
import DashbardLayout from "../layout/DashbardLayout"
import { useContext, useEffect, useState } from "react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axios from "axios";
import { apiEndpoints } from "../utils/ApiEndpoints";
import { Loader2 } from "lucide-react"
import DashboardUpload from "../components/DashboardUpload";
import RecentFiles from "../components/RecentFiles";

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [remainingUploads, setRemainingUploads] = useState(5);
    const { getToken } = useAuth();
    const { fetchUserCredits } = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    useEffect(() => {
        const fetchRecentFiles = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                const response = await axios.get(apiEndpoints.FETCH_FILES, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const sortedFiles = response.data.sort((a, b) =>
                    new Date(b.uploadedAt) - new Date(a.uploadedAt)
                ).slice(0, 5);
                setFiles(sortedFiles);
            } catch (error) {
                console.error('Error fetching recent files: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentFiles();
    }, [getToken]);

    const handleFileChange = (selectedFiles) => {
        if (uploadFiles.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType('error');
            return;
        }
        setUploadFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setMessage('');
        setMessageType('');
    }

    const handleRemoveFile = (index) => {
        setUploadFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setMessage('');
        setMessageType('');
    }

    useEffect(() => {
        setRemainingUploads(MAX_FILES - uploadFiles.length);
    }, [uploadFiles])

    const handleUpload = async () => {
        if (uploadFiles.length === 0) {
            setMessageType('error');
            setMessage('Please select at least one file to upload');
            return;
        }
        if (uploadFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType('error');
            return;
        }
        setUploading(true);
        setMessage('Uploading files...');
        setMessageType('info');

        const formData = new FormData();
        uploadFiles.forEach((file) => formData.append('files', file));

        try {
            const token = await getToken();
            await axios.post(apiEndpoints.UPLOAD_FILES, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage('Files uploaded successfully');
            setMessageType('success');
            setUploadFiles([]);

            // refresh the recent files
            const res = await axios.get(apiEndpoints.FETCH_FILES, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const sortedFiles = res.data.sort((a, b) =>
                new Date(b.uploadedAt) - new Date(a.uploadedAt)
            ).slice(0, 5);
            setFiles(sortedFiles);

            await fetchUserCredits();
        } catch (error) {
            console.error('Error uploading files', error);
            setMessage(error.response?.data?.message || 'Error uploading files. Please try again.');
            setMessageType('error');
        } finally {
            setUploading(false);
        }
    }

    return (
        <DashbardLayout activeMenu="Dashboard">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">My Drive</h1>

                <p className="text-gray-600 mb-6">Upload, manage, and share your files securely</p>

                {
                    message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700' : messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>
                            {message}
                        </div>
                    )
                }

                <div className="flex flex-col md:flex-row gap-6">
                    {/* left column */}
                    <div className="w-full md:w-[40%]">
                        <DashboardUpload
                            files={uploadFiles}
                            onFileChange={handleFileChange}
                            onUpload={handleUpload}
                            uploading={uploading}
                            onRemoveFile={handleRemoveFile}
                            remainingUploads={remainingUploads}
                        />
                    </div>

                    {/* Right column */}
                    <div className="w-full md:w-[60%]">
                        {
                            loading ? (
                                <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center gap-2">
                                    <Loader2 size={40} className="text-purple-500 animate-spin" />

                                    <p className="text-gray-500 text-lg">Loading your files...</p>
                                </div>
                            ) : (
                                <RecentFiles files={files} setFiles={setFiles} />
                            )
                        }
                    </div>
                </div>
            </div>
        </DashbardLayout>
    )
}

export default Dashboard