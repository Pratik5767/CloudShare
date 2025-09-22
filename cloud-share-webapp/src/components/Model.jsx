const Model = ({
    isOpen,
    onClose,
    title = "Confirm Action",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmationButtonClass = "bg-purple-600 hover:bg-purple-700",
    size = "sm",
    children,
}) => {
    if (!isOpen) return null;

    // Map size to width
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
            <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} p-5 animate-fade-in`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-800">{title}</h3>

                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none text-lg cursor-pointer">
                        ✕
                    </button>
                </div>

                <hr className="my-4 border-gray-200" />

                <div className="mt-3 text-gray-600 text-sm">{children}</div>

                <hr className="my-4 border-gray-200" />

                <div className="flex justify-end mt-5 space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition cursor-pointer">
                        {cancelText}
                    </button>

                    <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer transition ${confirmationButtonClass}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Model;