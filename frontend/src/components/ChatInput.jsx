import { useState } from "react";
import api from "../services/api";
import { Send } from "lucide-react";

export default function ChatInput({
  uploaded, messages, setMessages, loading, setLoading
}) {

  const [question, setQuestion] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">

      <div className="flex items-center gap-4">

        <input
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
          type="text"
          placeholder="Ask anything about your document..."
          className="flex-1 px-5 py-4 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!uploaded || loading}
        />

        <button
          disabled={!uploaded || loading}
          onClick={async()=>{

              if(question.trim()==="") return;

              const userQuestion=question;

              setMessages(prev=>[
                  ...prev,
                  {
                      type:"user",
                      text:userQuestion
                  }
              ]);

              setQuestion("");

              setLoading(true);

              const res=await api.post("/chat",{
                  question:userQuestion
              });

              setMessages(prev=>[
                  ...prev,
                  {
                      type:"bot",
                      text:res.data.answer,
                      sources:res.data.sources
                  }
              ]);

              setLoading(false);

          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-4 rounded-xl"
        >
          <Send size={18}/>
          Send
        </button>

      </div>
    </div>
  );
}