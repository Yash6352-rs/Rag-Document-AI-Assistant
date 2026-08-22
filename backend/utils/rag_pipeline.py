import os
import uuid
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

from langchain_community.retrievers import BM25Retriever

from utils.embeddings import load_vector_db
from utils.pdf_loader import load_pdf
from utils.chunking import create_chunks
from utils.embeddings import create_vector_db

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# BM25
bm25_retriever = None

def process_pdf(pdf_path):
    global bm25_retriever

    documents = load_pdf(pdf_path)
    document_id = str(uuid.uuid4())

    chunks = create_chunks(documents)

    for chunk in chunks:

        chunk.metadata["document_id"] = document_id
        chunk.metadata["filename"] = os.path.basename(pdf_path)

    # Store in Chroma
    create_vector_db(chunks)

    # Create BM25 retriever
    if bm25_retriever is None:
        bm25_retriever = BM25Retriever.from_documents(chunks)

    else:
        # Add new PDF chunks to existing BM25 index
        existing_docs = bm25_retriever.docs
        existing_docs.extend(chunks)

        bm25_retriever = BM25Retriever.from_documents(existing_docs)

    bm25_retriever.k = 4

    return {
        "document_id": document_id,
        "filename": os.path.basename(pdf_path),
        "chunks": len(chunks)
    }

# Query Rewriting
def rewrite_query(question, chat_history):

    if not chat_history:
        return question

    history_text = ""

    for message in chat_history[-6:]:

        history_text += (
            f"{message['role']}: "
            f"{message['content']}\n"
        )

    prompt = f"""
    Given the conversation history and the latest user question,
    rewrite the latest question into a standalone search query.

    If the question is already standalone, return it unchanged.

    Conversation history:
    {history_text}

    Latest question:
    {question}

    Return ONLY the standalone search query.
    """

    response = llm.invoke(prompt)

    return response.content.strip()

# Reciprocal Rank Fusion
def reciprocal_rank_fusion(vector_docs, keyword_docs, k=60):

    scores = {}
    documents = {}

    all_results = [vector_docs, keyword_docs]

    for results in all_results:
        for rank, doc in enumerate(results, start=1):
            key = (
                doc.metadata.get("filename"),
                doc.metadata.get("page"),
                doc.metadata.get("chunk_id")
            )

            score = 1 / (k + rank)

            scores[key] = scores.get(key, 0) + score
            documents[key] = doc

    ranked_documents = sorted(
        documents.items(),
        key=lambda x: scores[x[0]],
        reverse=True
    )

    return [
        doc
        for key, doc in ranked_documents[:4]
    ]
              
# Hybrid Retrieval
def hybrid_retrieve(query):
    vectordb = load_vector_db()

    # Vector search
    vector_retriever = vectordb.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 4,
            "fetch_k": 10,
            "lambda_mult": 0.5
        }
    )
    vector_docs = vector_retriever.invoke(query)

    # BM25 search (Keyword search)
    keyword_docs = []

    if bm25_retriever is not None:
        keyword_docs = bm25_retriever.invoke(query)

    # Reciprocal Rank Fusion
    final_docs = reciprocal_rank_fusion(vector_docs, keyword_docs)

    return final_docs

# RAG
def get_rag_chain():

    prompt = ChatPromptTemplate.from_template("""
        You are a helpful Document AI Assistant.

        Your task is to answer questions ONLY using the provided
        document context.

        Rules:

        - Never make up information.
        - If the answer is not found in the context, reply:
          "I couldn't find this information in the uploaded document."

        - Keep answers clear, concise, and well-structured.
        - Use bullet points whenever appropriate.
        - If the user asks for a definition, answer in 2–4 sentences.
        - If the user asks for a list, return a proper bullet list.
        - If the user asks for key points, provide concise bullet points.
        - If the user asks for a summary, summarize ONLY the provided context.
        - Do not mention information that is not present in the context.
        - Do not mention page numbers inside the answer.

        Context:
        {context}

        Question:
        {input}

        Answer:
    """)

    document_chain = create_stuff_documents_chain(
        llm,
        prompt
    )

    return document_chain