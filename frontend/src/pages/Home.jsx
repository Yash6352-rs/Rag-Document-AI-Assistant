import Header from "../components/Header";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/SideBar";
import { useState } from "react";

export default function Home() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);

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

      <div className="grid grid-cols-12 gap-5 mt-6">

        <div className="col-span-3">
          <Sidebar
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}

            uploaded={uploaded}
            setUploaded={setUploaded}

            status={status}
            setStatus={setStatus}

            chunks={chunks}
            setChunks={setChunks}

            processing={processing}
            setProcessing={setProcessing}
            
            documents={documents}
            setDocuments={setDocuments}
          />
        </div>

        <div className="col-span-9 flex flex-col gap-4">
          <ChatWindow
            messages={messages}
            loading={loading}
            setMessages={setMessages}
            uploaded={uploaded}
            setLoading={setLoading}
          />

        </div>

      </div>
    </div>
  );
}  