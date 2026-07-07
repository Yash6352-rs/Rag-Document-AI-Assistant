import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain

from utils.embeddings import load_vector_db
from utils.pdf_loader import load_pdf
from utils.chunking import create_chunks
from utils.embeddings import create_vector_db

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def process_pdf(pdf_path):
    documents = load_pdf(pdf_path)
    chunks = create_chunks(documents)
    create_vector_db(chunks)
    return len(chunks)

def get_rag_chain():
    vectordb = load_vector_db()

    retriever = vectordb.as_retriever(
      search_kwargs={"k":4}
    )

    prompt = ChatPromptTemplate.from_template("""
        You are a helpful Document AI Assistant.

        Your task is to answer questions ONLY using the provided document context.

        Rules:
        - Never make up information.
        - If the answer is not found in the context, reply:
        "I couldn't find this information in the uploaded document."
        - Keep answers clear, concise, and well-structured.
        - Use bullet points whenever appropriate.
        - If the user asks for a definition, answer in 2–4 sentences.
        - If the user asks for a list, return a proper bullet list.
        - If the user asks for key points, provide concise bullet points.
        - If the user asks for a summary, summarize ONLY the provided context in a few paragraphs or bullet points.
        - Do not mention information that is not present in the context.
        - Do not mention page numbers inside the answer; citations will be shown separately by the application.

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

    rag_chain = create_retrieval_chain(
        retriever,
        document_chain
    )

    return rag_chain