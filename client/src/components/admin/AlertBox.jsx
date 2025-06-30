export default function AlertBox({ message, type, onClose }) {
    if (!message) return null;

    const baseClasses = "px-4 py-3 rounded relative mb-4 shadow-md flex items-center justify-between";
    const typeClasses = {
        success: "bg-green-100 border border-green-400 text-green-700",
        error: "bg-red-100 border border-red-400 text-red-700",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
            <span className="block sm:inline">{message}</span>
            <button onClick={onClose} className="ml-4">
                <span className="text-2xl leading-none">&times;</span>
            </button>
        </div>
    );
}