import { FileText } from "lucide-react";

export default function Header() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center gap-5">

        <div className="w-18 h-18 rounded-xl bg-blue-100 flex items-center justify-center">
          <FileText className="w-10 h-10 text-blue-600" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-blue-600">
            Document AI Assistant
          </h1>

          <p className="text-slate-500 mt-1 text-lg">
            Upload a PDF and ask questions about its content.
          </p>
        </div>
      </div>
      
    </div>
  );
}