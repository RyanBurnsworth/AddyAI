import type MessageProps from '../../props/MessageProps';

export default function Message({ message, isUserInput }: MessageProps) {
  return (
    <>
      {isUserInput ? (
        <div className="flex justify-end mb-4">
          <div className="max-w-[75%] bg-zinc-700 text-white p-4 rounded-xl rounded-br-none shadow-md border border-zinc-600">
            <p className="text-zinc-200">{message}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-start mb-4">
          <div className="max-w-[75%] bg-zinc-800/70 text-white p-4 rounded-xl rounded-bl-none shadow-md border border-zinc-700">
            <div className="text-zinc-300" dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        </div>
      )}
    </>
  );
}
