import { Bot, User } from "lucide-react";

export default function Message({ message }) {
  const isUser = message.type === "user";

  return (
    <div className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}>

      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>

        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
          ${isUser ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        <div className={`rounded-2xl px-5 py-4 
          ${isUser? "bg-blue-600 text-white": "bg-white border border-slate-200"}`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>

          {!isUser && message.sources?.length > 0 && (
            <div className="mt-5 border-t pt-4">
              <p className="text-sm font-semibold text-slate-600 mb-3">
                📚 Sources
              </p>

              <div className="flex flex-wrap gap-2">
                {message.sources.map((source,index)=>(
                  <div key={index}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    <span> Page {source.page} </span>
                    <span className="text-slate-400"> | </span>
                    <span> Chunk {source.chunk} </span>
                  </div>
                ))}

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}