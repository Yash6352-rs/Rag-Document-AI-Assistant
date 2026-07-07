import { MessageCircle, Trash2, Bot } from "lucide-react";
import Message from "./Message";

export default function ChatWindow({ messages, loading, setMessages }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[650px]">

      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b">

        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-600" />
          <h2 className="text-xl font-semibold">
            Chat
          </h2>
        </div>

        <button 
          onClick={() => setMessages([])} 
          className="flex items-center gap-2 text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50">
          <Trash2 size={18} />
          Clear Chat
        </button>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8">
        {messages.length === 0 ? (
          
           <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot size={70} className="text-blue-600" />

            <h2 className="mt-5 text-3xl font-bold">
              Start a Conversation
            </h2>

            <p className="text-slate-500 mt-2">
              Upload a PDF and ask anything about it.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message key={index} message={msg} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl px-5 py-4">
                  🤖 Thinking...
                </div>
              </div>
            )}
          </>

        )}
      </div>

    </div>
  );
}