import type MessageProps from "../props/MessageProps";

export default function Message({ message, isUserInput }: MessageProps) {
    return (
        <>
            {isUserInput ? (
                <div className="w-full bg-gray-500 p-4 rounded-sm mb-1">
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
