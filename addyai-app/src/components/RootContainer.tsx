import { useRef, useState } from "react";
import MessageContainer from "./MessageContainer";
import UserImportForm from "./UserInputForm";
import type MessageProps from "../props/MessageProps";

export default function RootContainer() {
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesRef = useRef<MessageProps[]>([]); // Local mutable reference to track latest messages

    const handleSendMessage = async (message: string) => {
        const userMessage = { message, isUserInput: true };
        const responseMessage = { message: "", isUserInput: false };

        // Update both React state and the ref
        const newMessages = [...messagesRef.current, userMessage, responseMessage];
        messagesRef.current = newMessages;
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_prompt": message
                }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullMessage = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const text = line.replace("data: ", "");
                        if (text === "[DONE]") {
                            setIsLoading(false);
                            return;
                        }

                        fullMessage += text;

                        // Update the message directly in the ref
                        const updatedMessages = [...messagesRef.current];
                        updatedMessages[updatedMessages.length - 1] = {
                            message: fullMessage,
                            isUserInput: false,
                        };
                        messagesRef.current = updatedMessages;
                        setMessages(updatedMessages); // Push to React to re-render
                    }
                }
            }
        } catch (err) {
            console.error("Streaming error:", err);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col">
            <div className="w-full bg-gray text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">AddyAI</h1>
            </div>

            <div className="flex flex-1 w-full">
                <aside className="hidden md:block w-64 bg-gray border-r p-4">
                    <p className="font-semibold">Chat History</p>
                </aside>

                <main className="flex-1 flex flex-col items-center justify-between">
                    <MessageContainer messages={messages} isLoading={isLoading} />
                    <UserImportForm onMessageSubmitted={handleSendMessage} />
                </main>
            </div>
        </div>
    );
}
