# 📄 RAG Document AI Assistant

An AI-powered Document Question Answering system that allows users to upload a PDF and chat with its contents using Retrieval-Augmented Generation (RAG).

The application extracts text from uploaded PDFs, converts it into embeddings, stores them in ChromaDB, retrieves the most relevant information based on the user's query, and generates accurate answers using Google's Gemini 2.5 Flash model.

---

## ✨ Features

- Upload any PDF document
- Chat with your uploaded document
- Retrieval-Augmented Generation (RAG)
- Automatic text chunking
- ChromaDB vector database for semantic search
- Google Gemini 2.5 Flash for answer generation
- Source citations with Page Number and Chunk ID
- Fast semantic retrieval
- Modern React + Tailwind CSS UI
- Loading indicators during PDF processing and response generation
- Clear chat functionality
- Responsive interface

---

# 🏗️ Project Architecture

```
                User Uploads PDF
                        │
                        ▼
              PDF Text Extraction
                        │
                        ▼
                 Text Chunking
                        │
                        ▼
             Generate Embeddings
                        │
                        ▼
             Store in ChromaDB
                        │
                        ▼
                  User Question
                        │
                        ▼
         Semantic Similarity Search
                        │
                        ▼
            Retrieve Relevant Chunks
                        │
                        ▼
              Gemini 2.5 Flash LLM
                        │
                        ▼
            Answer + Source Citations
```

---

# ⚙️ Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React Icons

---

## Backend

- Flask
- Python

---

## AI / RAG

- LangChain
- Google Gemini 2.5 Flash
- ChromaDB
- HuggingFace Embeddings
- sentence-transformers/all-MiniLM-L6-v2

---

## PDF Processing

- PyPDFLoader
- RecursiveCharacterTextSplitter

---

# 🧠 How Chunking Works

After the user uploads a PDF:

1. The PDF is loaded using **PyPDFLoader**.
2. The extracted text is divided into smaller chunks using **RecursiveCharacterTextSplitter**.
3. Each chunk has:

  - Chunk Size: **800 characters**
  - Chunk Overlap: **150 characters**

Chunk overlap helps preserve context between adjacent chunks and improves retrieval quality.

Each chunk is also assigned a unique **Chunk ID**, which is later displayed as part of the answer citations.

---

# 🔍 How Retrieval Works

When a user asks a question:

1. The question is converted into an embedding.
2. ChromaDB performs semantic similarity search.
3. The **Top 4 most relevant chunks** are retrieved.
4. These chunks are passed to Gemini 2.5 Flash.
5. Gemini generates an answer **only using the retrieved context**.
6. The application displays:
   - Answer
   - Source Page Number
   - Chunk ID

This approach minimizes hallucinations by restricting the model to the retrieved document context.

---

# 📚 Source Citations

Each generated answer includes citations such as:

```
📚 Sources

Page 8 | Chunk 22
Page 10 | Chunk 31
Page 14 | Chunk 45
```

These citations help users identify where the information originated within the uploaded document.

---

# 📂 Folder Structure

```
Rag-Document-AI-Assistant/

├── backend/
│   ├── app.py
│   ├── uploads/
│   ├── chroma_db/
│   ├── utils/
│   │   ├── chunking.py
│   │   ├── embeddings.py
│   │   ├── pdf_loader.py
│   │   └── rag_pipeline.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🚀 Installation

## Backend

```bash
cd backend

conda create -n documentai python=3.10

conda activate documentai

pip install -r requirements.txt

python app.py
```

Backend runs at:

```
http://127.0.0.1:5000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

---

# 📷 Output

The `output/` folder contains:

- Screenshots
  - 1-homepage
  - 2-pdf-uploading
  - 3-pdf-uploaded
  - 4-user-ques
  - 5- assistant-answer
  - 6-Q-A
- Demo Video

---

# 💡 Future Improvements that can be done

- Multi-document support
- Conversation memory
- User authentication
- Cloud deployment
- Streaming AI responses

---

# 👨‍💻 Developed By

**Yash Panchal**
