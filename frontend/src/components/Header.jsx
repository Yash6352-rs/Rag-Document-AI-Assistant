import { FileText, Sparkles, Circle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 rounded-2xl py-1">

      <div className="px-6 py-4 flex items-center justify-between">

        {/* Left - Logo + Title */}
        <div className="flex items-center gap-4">

          {/* Logo */}
          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-blue-600
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <FileText
              size={26}
              strokeWidth={2}
              className="text-white"
            />
          </div>

          {/* Title */}
          <div>

            <div className="flex items-center gap-2">

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                Document AI Assistant
              </h1>

              <Sparkles
                size={18}
                strokeWidth={2.5}
                className="text-blue-600"
              />

            </div>

            <p className="text-sm text-slate-500mt-0.5">
              Intelligent document Q&A
            </p>

          </div>
        </div>


        {/* Right - System Status */}
        <div
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            bg-emerald-50
            border
            border-emerald-100
          "
        >

          <Circle
            size={9}
            fill="currentColor"
            className="text-emerald-500"
          />

          <span className=" text-xs font-semibold text-emerald-700">
            System Online
          </span>

        </div>

      </div>

    </header>
  );
}