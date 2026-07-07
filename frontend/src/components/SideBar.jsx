import { Upload, FileText, Info } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Sidebar({
  selectedFile, setSelectedFile, uploaded, setUploaded, status, setStatus,
  currentPdf, setCurrentPdf, chunks, setChunks, processing, setProcessing
}) {
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-full">

      {/* Upload Section */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800">
          <Upload className="text-blue-600" size={22} />
          Upload Document
        </h2>

        <div className="mt-5 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
          <Upload className="mx-auto text-blue-500" size={40} />

          <p className="mt-4 font-medium">
            Choose a PDF
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Drag & Drop or Browse
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              setSelectedFile(e.target.files[0])
            }}
            className="mt-5 block w-full text-sm"
          />
        </div>

        <button 
          onClick={async () => {
            if (!selectedFile) {
              toast.error("Please select a PDF.");
              return;
            }
            setProcessing(true);

            setStatus("Generating Embeddings...");

            const formData = new FormData();
            formData.append("pdf", selectedFile)

            try {
              const res = await api.post("/uploads", formData);
  
              setUploaded(true);
              setCurrentPdf(res.data.filename);
              setChunks(res.data.chunks);
              setStatus("Ready To Chat");
              toast.success(`PDF uploaded successfully!\n ${res.data.chunks} chunks created.`)
            }
            catch(error) {
              toast.error("Upload failed.");
            }
            finally {
              setProcessing(false);
            }
          }}
        
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold">
          
          {processing? (
            <div className="flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              Processing...
            </div>
          ) : (
            "Upload PDF"
          )}
        </button>
      </div>

      {/* Status */}
      <div className="mt-8 bg-slate-50 rounded-xl p-4 border">
        <h3 className="font-semibold flex items-center gap-2">
          <Info size={18} />
          Status
        </h3>

        <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm">
          {status}
        </div>
      </div>

      {/* Current Document */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText size={18} />
          Current Document
        </h3>

        <p className="mt-3 text-slate-600">
          {currentPdf || "None"}
        </p>

        {uploaded && (
          <p className="mt-3 text-sm text-slate-500">
            Chunks: {chunks}
          </p>
        )}

      </div>

      {/* Tips */}
      <div className="mt-6 rounded-xl bg-violet-50 border border-violet-100 p-4">
        <h3 className="font-semibold text-violet-700">
          💡 Tips
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Upload one PDF and ask questions about its contents.
        </p>
      </div>

    </div>
  );
}