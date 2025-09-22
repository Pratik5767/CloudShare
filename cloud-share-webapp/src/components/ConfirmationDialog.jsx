import Model from "./Model"

const ConfirmationDialog = (
    {
        isOpen,
        onClose,
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm,
        confirmationButtonClass = 'bg-red-600 hover:bg-red-700'
    }
) => {
    return (
        <div>
            <Model
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                confirmText={confirmText}
                cancelText={cancelText}
                onConfirm={onConfirm}
                confirmationButtonClass={confirmationButtonClass}
                size="sm"
            >
                <p className="text-gray-600">{message}</p>
            </Model>
        </div>
    )
}

export default ConfirmationDialog