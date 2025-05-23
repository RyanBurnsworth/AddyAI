import type MessageProps from "../props/MessageProps";

export default function Message({ message, isUserInput }: MessageProps) {
    return (
        <>
            {isUserInput ? (
                <div className="w-full bg-gray-700 p-4 rounded-sm mb-1 border-1 border-green-800">
                    <p>{message}</p>
                </div>
            ) : (
                <div
                    className="w-full p-2 mb-1"
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
        </>
    );
}
