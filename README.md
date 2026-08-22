# 📄 RAG Document AI Assistant

An AI-powered **Document Question Answering system** that allows users to upload multiple PDF documents and interact with them through a conversational AI interface.

The application uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded documents before generating answers with Google's Gemini LLM.

The system combines **semantic vector search, MMR, BM25 keyword search, and Reciprocal Rank Fusion (RRF)** to improve retrieval quality and provide more reliable answers with source citations.

---

# ✨ Features

- 📄 Upload multiple PDF documents
- 💬 Conversational document Q&A
- 🧠 Retrieval-Augmented Generation (RAG)
- ✂️ Automatic document chunking
- 🔢 Sentence Transformer embeddings
- 🗄️ Persistent ChromaDB vector database
- 🔍 Semantic vector search
- 🎯 MMR-based diverse retrieval
- 🔤 BM25 keyword-based retrieval
- 🔗 Reciprocal Rank Fusion (RRF)
- ✨ LLM-powered query rewriting
- 🤖 Google Gemini for answer generation
- 📚 Source citations with filename, page and chunk ID
- ⚡ Real-time streaming AI responses
- 🧾 Conversation history support
- 📂 Multi-PDF document management
- 🔄 Hybrid retrieval
- 🎨 Modern React + Tailwind CSS UI
- 🔔 Upload and processing status indicators
- 🗑️ Clear chat functionality
- ⌨️ Press Enter to send messages

---

# 🏗️ System Architecture

```text
                         USER
                           │
                           ▼
                 ┌───────────────────┐
                 │   React Frontend  │
                 │                   │
                 │ • PDF Upload      │
                 │ • Chat Interface  │
                 │ • Document List   │
                 │ • Sources         │
                 └─────────┬─────────┘
                           │
                           │ HTTP
                           ▼
                 ┌───────────────────┐
                 │   FastAPI Backend │
                 └─────────┬─────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      PDF Upload Flow              Question Flow
             │                           │
             ▼                           ▼
       PyPDFLoader                Query Rewriting
             │                    (Gemini LLM)
             ▼                           │
      Text Chunking                      ▼
             │                    Hybrid Retrieval
             ▼                    ┌───────────────┐
       Embeddings                │               │
             │                   ▼               ▼
             ▼                Vector Search   BM25 Search
        ChromaDB                  (MMR)        (Keyword)
             │                   │               │
             │                   └───────┬───────┘
             │                           ▼
             │                          RRF
             │                   (Score Fusion)
             │                           │
             │                           ▼
             │                    Top 4 Chunks
             │                           │
             └───────────────────────────┤
                                         ▼
                                Gemini LLM
                                         │
                                         ▼
                                  Generated Answer
                                         │
                              ┌──────────┴──────────┐
                              ▼                     ▼
                         AI Response          Citations
                              │              Filename/Page/
                              │                Chunk ID
                              ▼
                         Streaming
                              │
                              ▼
                       React Frontend
