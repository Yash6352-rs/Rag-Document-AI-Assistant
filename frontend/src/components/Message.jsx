import { Bot, User, FileText } from "lucide-react";

export default function Message({
  message, loading, isLast
}) {

  const isUser = message.type === "user";

  // Show Thinking only for the current bot message
  const showThinking =
    !isUser &&
    isLast &&
    loading &&
    !message.text;


  // Group sources by filename
  const groupedSources = {};

  if (!isUser && message.sources?.length > 0) {

    message.sources.forEach((source) => {
      const filename = source.filename || "Unknown document";

      if (!groupedSources[filename]) {
        groupedSources[filename] = [];
      }

      groupedSources[filename].push({
        page: source.page,
        chunk: source.chunk
      });
    });
  }


  return (
    <div
      className={` flex mb-6
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >

      <div
        className={` flex gap-3 max-w-[85%]
          ${isUser ? "flex-row-reverse" : ""}
        `}
      >

        {/* User / Bot Icon */}

        <div
          className={`
            w-10
            h-10
            min-w-10
            min-h-10
            flex-shrink-0
            rounded-full
            flex
            items-center
            justify-center
            ${
              isUser
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700"
            }
          `}
        >

          {isUser ? (
            <User size={20} />
          ) : (
            <Bot size={20} />
          )}

        </div>


        {/* Message Content*/}

        <div className="flex-1 min-w-0">

          <div
            className={`rounded-2xl px-5 py-4
              ${
                isUser
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-800"
              }
            `}
          >

            {/* Thinking */}

            {showThinking ? (

              <div className="
                flex
                items-center
                gap-2
                text-sm
                text-slate-600
              ">

                <span>🤖 </span>

                <span> Thinking... </span>

              </div>

            ) : (

              /*  Answer */
              <p className="whitespace-pre-wrap leading-7 text-sm">
                {message.text}
              </p>
            )}


            {/* Sources*/}
            {!isUser && message.sources?.length > 0 && (

              <div className="
                mt-5
                pt-4
                border-t
                border-slate-200
              ">

                {/* Sources title */}
                <div className=" flex items-center gap-2 mb-3">

                  <FileText
                    size={16}
                    className="text-blue-600"
                  />

                  <span className=" text-sm font-semibold text-slate-700">
                    Sources
                  </span>

                </div>


                {/* Grouped Documents */}
                <div className="space-y-3">

                  {Object.entries(groupedSources).map(
                    ([filename, sources]) => (

                    <div
                      key={filename}
                      className="
                        bg-slate-50
                        border
                        border-slate-200
                        rounded-xl
                        p-3
                      "
                    >

                      {/* Filename */}
                      <div className="flex items-center gap-1 mb-2">

                        <div className="
                          w-7
                          h-7
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          shrink-0
                        ">

                          <FileText size={14} className="text-red-500"/>

                        </div>

                        <p
                          className="
                            text-xs
                            font-semibold
                            text-slate-700
                            truncate
                          "
                          title={filename}
                        >
                          {filename}
                        </p>

                      </div>


                      {/* Page + Chunk */}
                      <div className=" flex flex-wrap gap-2">

                        {sources.map(
                          (source, index) => (

                          <span
                            key={index}
                            className="
                              inline-flex
                              items-center
                              px-2.5
                              py-1.5
                              rounded-lg
                              bg-white
                              border
                              border-slate-200
                              text-[11px]
                              font-medium
                              text-slate-600
                            "
                          >

                            Page {source.page}

                            <span className=" mx-1.5 text-slate-300">
                              •
                            </span>
                            Chunk {source.chunk}
                          </span>

                        ))}

                      </div>
                    </div>
                  ))}

                </div>
              </div>

            )}
          </div>
        </div>
      </div>

    </div>
  );
}