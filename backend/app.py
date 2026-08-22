import os
import json

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from utils.rag_pipeline import process_pdf, get_rag_chain, rewrite_query, hybrid_retrieve

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "Document AI Backend Running"
    }


@app.post("/uploads")
async def upload_pdf(pdf: UploadFile = File(...)):

    if not pdf.filename:
        return {
            "success": False,
            "message": "No file selected."
        }

    filename = pdf.filename

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    # Save PDF
    contents = await pdf.read()

    with open(filepath, "wb") as f:
        f.write(contents)

    results = process_pdf(filepath)

    return {
        "success": True,
        "document_id": results["document_id"],
        "filename": results["filename"],
        "chunks": results["chunks"]
    }

@app.post("/chat")
async def chat(data: dict):

    question = data.get("question", "").strip()
    document_id = data.get("document_id", "").strip()
    chat_history = data.get("chat_history", [])

    if not question:
        return {
            "success": False,
            "message": "Question cannot be empty."
        }

    if not document_id:
        return {
            "success": False,
            "message": "Document ID is required."
        }

    # Query rewriting
    search_query = rewrite_query(
        question,
        chat_history
    )

    # Hybrid retrieval
    documents = hybrid_retrieve(search_query)

    # Get document chain
    document_chain = get_rag_chain()

    # Citations
    unique_sources = set()

    for doc in documents:

        filename = doc.metadata.get("filename", "Unknown")
        page = doc.metadata.get("page", 0) + 1
        chunk = doc.metadata.get("chunk_id", "-")

        unique_sources.add(
            (filename, page, chunk)
        )

    sources = [
        {
            "filename": filename,
            "page": page,
            "chunk": chunk
        }
        for filename, page, chunk in sorted(unique_sources)
    ]

    def generate():

        # Stream answer tokens
        for chunk in document_chain.stream({
            "context": documents,
            "input": question
        }):

            if chunk:

                yield json.dumps({
                    "type": "token",
                    "content": chunk
                }) + "\n"

        # Send citations AFTER answer is complete
        yield json.dumps({
            "type": "sources",
            "sources": sources
        }) + "\n"

    return StreamingResponse(
        generate(),
        media_type="application/x-ndjson"
    )