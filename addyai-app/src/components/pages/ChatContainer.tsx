import { useEffect, useRef, useState } from "react";
import type MessageProps from "../../props/MessageProps";
import MessageContainer from "../MessageContainer";
import UserImportForm from "../UserInputForm";
import { useLocation } from "react-router-dom";
import { SnackBar } from "../reusable/SnackBar";
import { APPLICATION_JSON, CUSTOMER_ID, POST } from "../../utils/constants";

export default function ChatContainer() {
    const location = useLocation();
    const initialMessage = (location.state as { initialMessage?: string})?.initialMessage;

    const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
    
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);    
    const messagesRef = useRef<MessageProps[]>([]); // Local mutable reference to track latest messages

    const handleSendMessage = async (message: string) => {
        const userMessage = { message, isUserInput: true };
        const responseMessage = { message: "", isUserInput: false };
        const customerId = localStorage.getItem(CUSTOMER_ID);
        const messagingUrl = import.meta.env.VITE_MESSAGING_URL;

        // Update both React state and the ref
        const newMessages = [...messagesRef.current, userMessage, responseMessage];
        messagesRef.current = newMessages;
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch(messagingUrl, {
                method: POST,
                headers: {
                    CONTENT_TYPE: APPLICATION_JSON,
                },
                body: JSON.stringify({
                    "user_prompt": message,
                    "account_id": customerId
                }),
            });

            if (!response.body) throw new Error("No response body");
            const content = await response.json();
            if (!content || content.status == 400 || content.status == 404 || content.status == 500) {
                
            }

            setIsLoading(false);

        } catch (err) {
            console.error("Fetching error:", err);
            setIsLoading(false);
            setErrorMessage("Error receiving response from service. Please try again.");
            setShowSnackBar(true);
        }
    };

    useEffect(() => {
        if (initialMessage) {
            handleSendMessage(initialMessage);
        }
    }, [initialMessage]);
    
    return (
        <div className="min-h-screen w-screen flex flex-col">
            <div className="w-full bg-gray text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">AddyAI</h1>
            </div>

            <div className="flex flex-1 w-full">
                <aside className="hidden md:block w-64 bg-zinc-900 p-4">
                    <p className="font-semibold">Chat History</p>
                </aside>

                <main className="flex-1 flex flex-col items-center justify-between">
                    <MessageContainer messages={messages} isLoading={isLoading} />
                    <UserImportForm onMessageSubmitted={handleSendMessage} />
                </main>
            </div>

            <SnackBar
                message={errorMessage}
                color="bg-red-900"
                duration={2000}
                onClose={() => setShowSnackBar(false)}
                show={showSnackBar}
            />
        </div>
    );
}
