import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoints } from "../utils/ApiEndpoints";
import toast from "react-hot-toast";
import { Copy, Share2, Info, Download, File } from "lucide-react";
import LinkShareModel from "../components/LinkShareModel";

const PublicFileView = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shareModal, setShareModal] = useState({
        isOpen: false,
        link: ""
    });
    const { getToken } = useAuth();
    const { fileId } = useParams();

    useEffect(() => {
        const getFile = async () => {
            setLoading(true);
            try {
                const response = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId));
                setFile(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching files: ', error);
                setError('Could not retrive file. The link may be invalid or the file may have been removed');
            } finally {
                setLoading(false);
            }
        };
        getFile();
    }, [fileId, getToken])

    const handleDownload = async () => {
        try {
            const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download feiled: ', error);
            toast.error('Sorry, the file could not be downloaded');
        }
    };

    const openShareModel = () => {
        setShareModal({
            isOpen: true,
            link: window.location.href
        });
    }

    const closeShareModel = () => {
        setShareModal({
            isOpen: false,
            link: ''
        });
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600">Loading files....</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-600">Error</h2>

                    <p className="text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        )
    }

    if (!file) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="p-4 border-b bg-white sticky top-0">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Share2 className="text-blue-600" />

                        <span className="font-bold text-xl text-gray-800">CloudShare</span>
                    </div>

                    <button
                        onClick={openShareModel}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
                    >
                        <Copy size={18} /> Share Link
                    </button>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 flex justify-center">
                <div className="w-full max-w-3xl">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <File size={40} className="text-blue-500" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-semibold text-gray-800 break-words">
                            {file.name}
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            {(file.size / 1024).toFixed(2)} KB

                            <span className="mx-2">&bull;</span> Shared on{" "}
                            {
                                new Date(file.uploadedAt).toLocaleDateString()
                            }
                        </p>

                        <div className="my-6">
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                                {file.fileType || "File"}
                            </span>
                        </div>

                        <div className="flex justify-center gap-4 my-8">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition cursor-pointer"
                            >
                                <Download size={18} />
                                Download File
                            </button>
                        </div>

                        <hr className="my-6" />

                        <div>
                            <h3 className="text-lg font-semibold text-left text-gray-800 mb-4">
                                File Information
                            </h3>

                            <div className="text-left text-sm space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">File Name:</span>

                                    <span className="text-gray-800 font-medium break-all">
                                        {file.name}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">File Type:</span>

                                    <span className="text-gray-800 font-medium">{file.fileType}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">File Size:</span>

                                    <span className="text-gray-800 font-medium">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shared:</span>

                                    <span className="text-gray-800 font-medium">
                                        {
                                            new Date(file.uploadedAt).toLocaleDateString()
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start space-x-2">
                        <Info size={20} className="mt-0.5" />

                        <p className="text-sm">
                            This file has been shared publicly. Anyone with this link can view and
                            download it.
                        </p>
                    </div>
                </div>
            </main>

            <LinkShareModel
                isOpen={shareModal.isOpen}
                onClose={closeShareModel}
                link={shareModal.link}
                title="Share File"
            />
        </div>
    )
}

export default PublicFileView;