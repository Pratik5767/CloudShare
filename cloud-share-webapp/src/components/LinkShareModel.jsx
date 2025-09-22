import { Check, Copy } from "lucide-react";
import { useState } from "react";

const LinkShareModel = ({ isOpen, onClose, link, title = "Share File" }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link", err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer">
                        ✕
                    </button>
                </div>

                <hr className="my-4 border-gray-200" />

                <p className="text-gray-700 mt-3 text-sm">
                    Share this link with others to give them access to this file:
                </p>

                <div className="flex items-center border border-gray-300 rounded mt-4 overflow-hidden">
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="flex-1 p-2 text-sm text-gray-700 focus:border-2 focus:border-purple-700 outline-none bg-gray-50"
                    />

                    <button
                        onClick={handleCopy}
                        className={`px-3 py-2 hover:bg-gray-200 border-l border-gray-300 ${copied ? 'bg-green-200' : 'bg-gray-100'}`}
                        title="Copy link"
                    >
                        {
                            copied ? <Check size={18} className="text-green-600 cursor-pointer" /> : <Copy size={18} className="text-gray-600 cursor-pointer" />
                        }
                    </button>
                </div>

                {
                    copied && (
                        <p className="text-green-600 text-sm mt-2">Link copied to clipboard!</p>
                    )
                }

                <p className="text-gray-500 text-xs mt-3">Anyone with this link can access this file.</p>

                <hr className="my-4 border-gray-200" />

                <div className="flex justify-end mt-6 space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer">
                        Close
                    </button>

                    <button onClick={handleCopy} className={`px-4 py-2 hover:bg-purple-700 text-white rounded transition cursor-pointer ${copied ? 'bg-green-600' : 'bg-purple-600'}`}>
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkShareModel;