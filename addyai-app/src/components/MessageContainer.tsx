import { BeatLoader } from "react-spinners"
import type MessageProps from "../props/MessageProps"
import Message from "./Message"
import { useEffect, useRef } from "react";

function MessageContainer({messages, isLoading}: {messages: MessageProps[], isLoading: boolean}) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to the bottom of the chat when messages change
    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
        <div className="w-full sm:w-[300px] md:w-[600px] lg:w-[800px] max-h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 p-4">
            {messages.map((msg, idx) =>
                    msg.isUserInput ? (
                        <Message key={idx} message={msg.message} isUserInput={true} />
                    ) : (
                        <Message key={idx} message={msg.message} isUserInput={false} />
                    )
            )}
            <div ref={messagesEndRef} />
        </div>
        
        {isLoading &&
            <div className="flex items-center justify-center">
                <BeatLoader color="#4ade80" size={16} />
            </div>
        }
        </>
    )
}

export default MessageContainer
