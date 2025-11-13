import { useState } from "react";

interface UserImportFormProps {
    onMessageSubmitted: (message: string) => void;
}

function UserImportForm({ onMessageSubmitted }: UserImportFormProps) {
    const [message, setMessage] = useState("")

    const handleMessageSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (message.trim() === "") return;

        onMessageSubmitted(message);
        setMessage("");
    };

    return (
        <>
        <form onSubmit={handleMessageSubmit}>
            <div className="flex items-center justify-center w-full sm:w-[400px] md:w-[600px] lg:w-[800px] p-4 rounded-b-md shadow-md">
                    <input type="text" 
                        value={message}
                        maxLength={2000}
                        onChange={(e) => setMessage(e.target.value) }
                        className="w-full m-4 p-2 bg-gray-600 text-white border-black border-2 rounded-md" />
                    <button className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow">
                        +
                    </button>
            </div>
        </form>
        </>
    )
}

export default UserImportForm;
