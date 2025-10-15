import type MessageProps from "../props/MessageProps"
import Message from "./Message"

function MessageContainer({messages, isLoading}: {messages: MessageProps[], isLoading: boolean}) {
    return (
        <>
        <div className="w-full sm:w-[300px] md:w-[600px] lg:w-[800px] max-h-[90vh] overflow-auto p-4">
            {messages.map((msg, idx) =>
                    msg.isUserInput ? (
                        <Message key={idx} message={msg.message} isUserInput={true} />
                    ) : (
                        <Message key={idx} message={msg.message} isUserInput={false} />
                    )
            )}
        </div>
        
        {isLoading &&
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        }

        </>
    )
}

export default MessageContainer
