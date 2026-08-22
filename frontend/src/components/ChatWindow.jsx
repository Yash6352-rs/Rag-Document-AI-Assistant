import { MessageCircle, Trash2, Bot } from "lucide-react";

import Message from "./Message";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  messages, loading, setMessages, uploaded, setLoading
}) {

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        flex
        flex-col
        h-[750px]
        overflow-hidden
      "
    >

      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-5
          border-b
          border-slate-200
          bg-white
          shrink-0
        "
      >

        {/* Left */}
        <div className="flex items-center gap-3">

          <div className="px-2">

            <MessageCircle
              size={40}
              className="text-blue-600"
            />

          </div>

          <div>
            <h2 className=" text-[21px] font-semibold text-slate-900 ">
              AI Assistant
            </h2>

            <p className="text-[13px] text-slate-500 mt-0.2">
              Ask questions about your documents
            </p>
          </div>

        </div>


        {/* Clear Chat */}

        <button
          onClick={() => setMessages([])}
          disabled={loading || messages.length === 0}
          className="
            flex
            items-center
            gap-2
            px-5
            py-3.5
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            text-sm
            font-medium
            hover:bg-red-50
            hover:text-red-500
            hover:border-red-200
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
          "
        >

          <Trash2 size={18} />
          <span> Clear Chat</span>
        </button>

      </div>


      {/* Messages */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          px-5
          py-6
        "
      >

        {messages.length === 0 ? (

          /* Empty State */
          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div>
              <Bot size={70}className="text-blue-600"/>
            </div>

            <h2
              className=" mt-4text-2xl font-bold text-slate-800"
            >
              Start a Conversation
            </h2>


            <p
              className="text-lg text-slate-500 mt-2max-w-smleading-6"
            >
              Upload your PDFs and ask questions
              about their content.
            </p>


            {!uploaded && (

              <div
                className="
                  mt-4
                  px-3
                  py-2
                  rounded-lg
                  bg-slate-50
                  border
                  border-slate-200
                  text-xs
                  text-slate-500
                "
              >
                Upload a PDF to start chatting
              </div>

            )}
          </div>

        ) : (

          messages.map((msg, index) => (

            <Message
              key={index}
              message={msg}
              loading={loading}
              isLast={index === messages.length - 1}
            />
          ))
        )}

      </div>


      {/* Chat Input */}

      <div
        className="shrink-0 p-5  border-t border-slate-200 bg-white"
      >
        <ChatInput
          uploaded={uploaded}
          messages={messages}
          setMessages={setMessages}
          loading={loading}
          setLoading={setLoading}
        />

      </div>
    </div>
  );
}