import { FileIcon, FileText, Image, Music, Video } from "lucide-react";

const GetFileIcon = ({ file }) => {
    const extenstion = file.name.split('.').pop().toLowerCase();

    if (['jpeg', 'jpg', 'png', 'gif', 'svg', 'webp'].includes(extenstion)) {
        return <Image size={24} className="text-purple-500" />
    }

    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extenstion)) {
        return <Video size={24} className="text-blue-500" />
    }

    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extenstion)) {
        return <Music size={24} className="text-green-500" />
    }

    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extenstion)) {
        return <FileText size={24} className="text-amber-500" />
    }

    return <FileIcon size={24} className="text-purple-500" />
};

export default GetFileIcon;