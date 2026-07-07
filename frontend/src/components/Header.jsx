import { FileText } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-center gap-4">

        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
          <FileText className="w-8 h-8 text-blue-600" />
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