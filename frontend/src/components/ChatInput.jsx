import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({
  uploaded,
  messages,
  setMessages,
  loading,
  setLoading,
}) {
  const [question, setQuestion] = useState("");

  const sendMessage = async () => {
    if (!question.trim() || loading || !uploaded) {
      return;
    }

    const userQuestion = question.trim();

    // Create chat history BEFORE adding current question
    const chatHistory = messages.map((message) => ({
      role: message.type === "user" ? "user" : "assistant",
      content: message.text || "",
    }));

    // Add user message + temporary bot message
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userQuestion,
      },
      {
        type: "bot",
        text: "",
        sources: [],
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          document_id: "global",
          chat_history: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      if (!response.body) {
        throw new Error("Streaming response not available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let answer = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        // Keep incomplete line for next chunk
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          try {
            const data = JSON.parse(line);

            // AI response token
            if (data.type === "token") {
              answer += data.content;

              setMessages((prev) => {
                const updated = [...prev];

                const lastIndex = updated.length - 1;

                updated[lastIndex] = {
                  ...updated[lastIndex],
                  text: answer,
                };

                return updated;
              });
            }

            // Citations
            if (data.type === "sources") {
              setMessages((prev) => {
                const updated = [...prev];

                const lastIndex = updated.length - 1;

                updated[lastIndex] = {
                  ...updated[lastIndex],
                  sources: data.sources,
                };

                return updated;
              });
            }
          } catch (parseError) {
            console.error("Failed to parse stream:", line);
          }
        }
      }

      // Process any remaining buffered data
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);

          if (data.type === "token") {
            answer += data.content;

            setMessages((prev) => {
              const updated = [...prev];

              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: answer,
              };

              return updated;
            });
          }

          if (data.type === "sources") {
            setMessages((prev) => {
              const updated = [...prev];

              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                sources: data.sources,
              };

              return updated;
            });
          }
        } catch (error) {
          console.error("Final stream parsing error:", error);
        }
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => {
        const updated = [...prev];

        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          text: "Something went wrong. Please try again.",
          sources: [],
        };

        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // Enter key handling
  const handleKeyDown = (e) => {
    // Enter = Send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      sendMessage();
    }
  };

  return (
    <div>
      <div className="flex items-end gap-3">
        {/* Input */}

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            uploaded
              ? "Ask anything about your documents..."
              : "Upload a PDF to start chatting..."
          }
          rows={1}
          disabled={!uploaded || loading}
          className="
            flex-1 resize-none
            bg-slate-50
            border
            border-slate-200
            rounded-xl
            px-4
            py-5
            text-sm
            text-slate-800
            placeholder:text-slate-400
            outline-none
            focus:border-blue-400
            focus:ring-2
            focus:ring-blue-100
            disabled:bg-slate-100
            disabled:cursor-not-allowed
            transition
          "
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={sendMessage}
          disabled={!uploaded || loading || !question.trim()}
          className="
            h-15
            px-5
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-300
            disabled:cursor-not-allowed
            text-white
            font-medium
            flex
            items-center
            justify-center
            gap-2
            transition
            shrink-0
          "
        >
          <Send size={17} />

          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}
