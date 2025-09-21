import { useEffect, useState } from "react"
import DashbardLayout from "../layout/DashbardLayout"
import { Copy, Download, Eye, File, FileIcon, FileText, Globe, Grid, Image, List, Lock, Music, Trash2, Video } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";

const MyFiles = () => {
    const [files, setFiles] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const fetchFiles = async () => {
        try {
            const token = await getToken();
            const response = await axios.get('http://localhost:8080/api/v1/files/my', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                //console.log(response.data);
                setFiles(response.data);
            }
        } catch (error) {
            console.log('Error fetching the files from server: ', error);
            toast.error('Error fetching the files from server: ', error.message);
        }
    }

    const getFileIcon = (file) => {
        const extenstion = file.name.split('.').pop().toLowerCase();

        if (['jpeg', 'jpg', 'png', 'gif', 'svg', 'webp'].includes(extenstion)) {
            return <Image size={24} className="text-purple-500" />
        }

        if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extenstion)) {
            return <Video size={24} className="text-blue-500" />
        }

        if (['mp4', 'wav', 'ogg', 'flac', 'm4a'].includes(extenstion)) {
            return <Music size={24} className="text-green-500" />
        }

        if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extenstion)) {
            return <FileText size={24} className="text-amber-500" />
        }

        return <FileIcon size={24} className="text-purple-500" />
    }

    useEffect(() => {
        fetchFiles();
    }, [getToken])

    return (
        <DashbardLayout activeMenu={"My Files"}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Files {files.length}</h2>

                    <div className="flex items-center gap-3">
                        <List
                            onClick={() => setViewMode("list")}
                            size={24}
                            className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        />

                        <Grid
                            onClick={() => setViewMode("grid")}
                            className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        />
                    </div>
                </div>

                {
                    files.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
                            <File
                                size={60}
                                className="text-purple-300 mb-4"
                            />

                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                No Files uploaded yet
                            </h3>

                            <p className="text-gray-500 text-center max-w-md mb-6">
                                Start uploading files to see them listed here. you can upload documents, images and other files to share and manage them securely.
                            </p>

                            <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors cursor-pointer" onClick={() => navigate("/upload")}>
                                Go to Upload
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {
                                files.map((file) => (
                                    <FileCard key={file.id} file={file} />
                                ))
                            }
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {
                                        files.map((file) => (
                                            <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                    <div className="flex items-center gap-2">
                                                        {getFileIcon(file)}

                                                        {file.name}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div className="flex items-center gap-4">
                                                        <button className="flex items-center gap-2 cursor-pointer group">
                                                            {
                                                                file.isPublic ? (
                                                                    <>
                                                                        <Globe size={16} className="text-green-500" />

                                                                        <span className="group-hover:underline">
                                                                            Public
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Lock size={16} className="text-gray-500" />

                                                                        <span className="group-hover:underline">
                                                                            Private
                                                                        </span>
                                                                    </>
                                                                )
                                                            }
                                                        </button>

                                                        {
                                                            file.isPublic && (
                                                                <button className="flex items-center gap-2 cursor-pointer group text-blue-600">
                                                                    <Copy size={16} />

                                                                    <span className="group-hover:underline">
                                                                        Share Link
                                                                    </span>
                                                                </button>
                                                            )
                                                        }
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="flex justify-center">
                                                            <button title="Download" className="text-gray-500 hover:text-blue-600 cursor-pointer">
                                                                <Download size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="flex justify-center">
                                                            <button title="Delete" className="text-gray-500 hover:text-red-600 cursor-pointer">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="flex justify-center">
                                                            {
                                                                file.isPublic ? (
                                                                    <Link to={`/file/${file.id}`} className="text-gray-500 hover:text-blue-600">
                                                                        <Eye size={18} />
                                                                    </Link>
                                                                ) : (
                                                                    <span className="w-[18px]">
                                                                    </span>
                                                                )
                                                            }
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
                }
            </div>
        </DashbardLayout>
    )
}

export default MyFiles