import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from utils.rag_pipeline import process_pdf, get_rag_chain

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Document AI Backend Running"
    })


@app.route("/uploads", methods=["POST"])
def upload_pdf():

    if "pdf" not in request.files:
        return jsonify({
            "success": False,
            "message": "No PDF uploaded."
        }), 400

    file = request.files["pdf"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "No file selected."
        }), 400

    # Delete previous uploaded PDF
    for old_file in os.listdir(UPLOAD_FOLDER):
        old_path = os.path.join(UPLOAD_FOLDER, old_file)

        if os.path.isfile(old_path):
            os.remove(old_path)

    filename = secure_filename(file.filename)

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )

    file.save(filepath)

    total_chunks = process_pdf(filepath)

    return jsonify({
        "success": True,
        "filename": filename,
        "chunks": total_chunks
    })


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "success": False,
            "message": "Question cannot be empty."
        }), 400

    qa = get_rag_chain()

    result = qa.invoke({
        "input": question
    })

    unique_sources = set()

    for doc in result["context"]:

        page = doc.metadata.get("page", 0) + 1
        chunk = doc.metadata.get("chunk_id", "-")

        unique_sources.add((page, chunk))

    sources = [
        {
            "page": page,
            "chunk": chunk
        }
        for page, chunk in sorted(unique_sources)
    ]

    return jsonify({
        "success": True,
        "answer": result["answer"],
        "sources": sources
    })


if __name__ == "__main__":
    app.run(debug=True)