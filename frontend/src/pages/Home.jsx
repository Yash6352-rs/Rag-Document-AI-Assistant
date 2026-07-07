import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { useState } from "react";

export default function Home() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("No PDF Uploaded");
  const [currentPdf, setCurrentPdf] = useState("");
  const [chunks, setChunks] = useState(0);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Header />

      <div className="grid grid-cols-12 gap-6 mt-6">

        <div className="col-span-3">
          <Sidebar
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            uploaded={uploaded}
            setUploaded={setUploaded}
            status={status}
            setStatus={setStatus}
            currentPdf={currentPdf}
            setCurrentPdf={setCurrentPdf}
            chunks={chunks}
            setChunks={setChunks}
            processing={processing}
            setProcessing={setProcessing}
          />
        </div>

        <div className="col-span-9 flex flex-col gap-4">
          <div className="flex flex-col gap-4 h-[750px]">
            <ChatWindow 
              messages={messages}
              loading={loading}
              setMessages={setMessages}
            />

            <ChatInput
              uploaded={uploaded}
              messages={messages}
              setMessages={setMessages}
              loading={loading}
              setLoading={setLoading}
            />

          </div>
        </div>

      </div>
    </div>
  );
}  