import { Upload, FileText, CheckCircle2 } from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";

export default function Sidebar({
  selectedFile, setSelectedFile,
  setUploaded, status, setStatus,
  setChunks, processing, setProcessing,
  documents, setDocuments
}) {

  const handleUpload = async () => {

    if (!selectedFile) {
      toast.error("Please select a PDF.");
      return;
    }

    setProcessing(true);
    setStatus("Generating Embeddings...");

    const formData = new FormData();

    formData.append("pdf", selectedFile);

    try {
      const res = await api.post(
        "/uploads",
        formData
      );

      const newDocument = {
        id: res.data.document_id,
        filename: res.data.filename,
        chunks: res.data.chunks
      };

      // Add new document to the list
      setDocuments(prev => [
        ...prev,
        newDocument
      ]);

      setUploaded(true);
      setChunks(res.data.chunks);
      setStatus("Ready To Chat");

      // Clear selected file
      setSelectedFile(null);

      toast.success(
        `PDF uploaded successfully! ${res.data.chunks} chunks created.`
      );

    } catch (error) {
      console.error(error);

      setStatus("Upload Failed");
      toast.error("Upload failed.");

    } finally {
      setProcessing(false);
    }
  };


  return (
    <div className="
      bg-white
      rounded-2xl
      border
      border-slate-200
      shadow-sm
      p-5
      h-full
    ">

      {/* Upload Header */}
      <div className="flex items-center gap-3">

        <div className="
          w-12
          h-12
          rounded-xl
          bg-blue-50
          flex
          items-center
          justify-center
        ">
          <Upload size={21} className="text-blue-600" />
        </div>

        <div>
          <p className="
            text-[19px]
            font-semibold
            text-slate-800
          ">
            Upload Documents
          </p>

          <p className="
            text-xs
            text-slate-500
            mt-0.5
          ">
            Add PDFs to your knowledge base
          </p>
        </div>
      </div>


      {/* Upload Box */}

      <label
        htmlFor="pdf-upload"
        className="
          mt-5
          border-2
          border-dashed
          border-slate-200
          rounded-xl
          p-6
          text-center
          hover:border-blue-400
          hover:bg-blue-50/30
          transition
          cursor-pointer
          block
        "
      >

        <div className="
          mx-auto
          flex
          items-center
          justify-center
        ">
          <Upload size={30} className="text-blue-600"/>
        </div>

        <p className="
          mt-3
          font-medium
          text-slate-800
        ">
          Choose a PDF
        </p>


        <p className=" text-xs text-slate-500 mt-1">
          PDF files only
        </p>

        <p className="
          mt-3
          text-xs
          text-blue-600
          truncate
          px-2
        ">
          {selectedFile ? selectedFile.name
            : "No file selected"
          }
        </p>
      </label>


      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {

          const file = e.target.files?.[0];

          if (file) {
            setSelectedFile(file);
          }

        }}
      />


      {/* Upload Button */}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || processing}
        className="
          w-full
          mt-4
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-blue-300
          disabled:cursor-not-allowed
          text-white
          py-3
          rounded-xl
          font-semibold
          transition
        "
      >
        {processing ? (

          <div className="
            flex
            items-center
            justify-center
            gap-2
          ">

            <div className="
              w-4
              h-4
              border-2
              border-white
              border-t-transparent
              rounded-full
              animate-spin
            " />
            Processing...
          </div>

        ) : (
          "Upload PDF"
        )}

      </button>


      {/* Status */}
      <div className="
        mt-5
        rounded-xl
        bg-slate-50
        border
        border-slate-200
        p-3.5
      ">

        <div className="
          flex
          items-center
          justify-between
          gap-2
        ">

          <div className="
            flex
            items-center
            gap-2
          ">

            <span className="
              w-2
              h-2
              rounded-full
              bg-emerald-500
            " />

            <span className="
              text-sm
              font-medium
              text-slate-700
            ">
              Status
            </span>

          </div>

          <span className="
            text-xs
            font-medium
            text-slate-500
            truncate
          ">
            {status}
          </span>

        </div>

      </div>

      {/*  Uploaded Documents*/}
      <div className="mt-6">

        {/* Section Header */}

        <div className="
          flex
          items-center
          justify-between
          mb-3
        ">

          <div className="flex items-center gap-2">

            <FileText
              size={18}
              className="text-blue-600"
            />

            <h3 className="
              font-semibold
              text-slate-800
            ">
              Uploaded Documents
            </h3>

          </div>


          <span className="
            min-w-6
            h-6
            px-2
            rounded-full
            bg-blue-50
            text-blue-600
            text-xs
            font-semibold
            flex
            items-center
            justify-center
          ">
            {documents.length}
          </span>

        </div>

        {/* Scrollable Document List */}
        <div className="
          space-y-2
          max-h-[330px]
          overflow-y-auto
          pr-1
        ">

          {documents.length === 0 ? (

            <div className="
              border
              border-dashed
              border-slate-200
              rounded-xl
              p-5
              text-center
            ">

              <FileText
                size={28}
                className="
                  mx-auto
                  text-slate-300
                "
              />

              <p className="
                text-sm
                text-slate-500
                mt-2
              ">
                No documents uploaded
              </p>

              <p className="
                text-xs
                text-slate-400
                mt-1
              ">
                Upload a PDF to get started
              </p>

            </div>

          ) : (

            documents.map((document) => (

              <div
                key={document.id}
                className="
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  hover:border-blue-200
                  hover:bg-blue-50/30
                  transition
                "
              >

                {/* PDF Icon */}

                <div className="pl-1.5 pr-1">

                  <FileText
                    size={32}
                    className="text-red-500"
                  />

                </div>


                {/* File Details */}

                <div className="
                  min-w-0
                  flex-1
                ">

                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-800
                      truncate
                    "
                    title={document.filename}
                  >
                    {document.filename}
                  </p>


                  <p className="
                    text-xs
                    text-slate-500
                    mt-1
                  ">
                    {document.chunks} chunks
                  </p>

                </div>


                {/* Uploaded Status */}

                <CheckCircle2
                  size={17}
                  className="
                    text-emerald-500
                    shrink-0
                  "
                />

              </div>

            ))

          )}
        </div>

      </div>
    </div>
  );
}