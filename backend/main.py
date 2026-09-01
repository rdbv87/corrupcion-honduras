import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import chromadb
from config import OLLAMA_BASE_URL, OLLAMA_MODEL, CHROMA_PERSIST_DIR, CORS_ORIGINS
import json

app = FastAPI(
    title="Corrupción Honduras - Chatbot RAG",
    description="Chatbot con RAG para consultas sobre corrupción en Honduras",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=json.loads(CORS_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
collection = chroma_client.get_or_create_collection(
    name="corrupcion_hn",
    metadata={"hnsw:space": "cosine"},
)

SYSTEM_PROMPT = """Eres un asistente especializado en corrupción en Honduras. Tu función es responder preguntas sobre casos de corrupción documentados en la base de datos del sistema.

Reglas estrictas:
- SOLO responde sobre temas de corrupción en Honduras
- NO respondas sobre política internacional, entretenimiento, u otros temas
- Si te preguntan algo fuera de contexto, responde: "Solo puedo ayudarte con información sobre corrupción en Honduras."
- Cita las fuentes cuando estén disponibles
- Sé objetivo y basado en hechos documentados
- Usa un tono formal y accesible"""


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    response: str
    sources: list[str] = []
    rag_used: bool = False


class IngestRequest(BaseModel):
    content: str
    metadata: dict = {}
    doc_id: Optional[str] = None


def get_embedding(text: str) -> list[float]:
    response = httpx.post(
        f"{OLLAMA_BASE_URL}/api/embeddings",
        json={"model": OLLAMA_MODEL, "prompt": text},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["embedding"]


def query_rag(question: str, n_results: int = 3) -> tuple[str, list[str]]:
    try:
        results = collection.query(
            query_texts=[question],
            n_results=n_results,
        )
    except Exception:
        return "", []

    if not results["documents"] or not results["documents"][0]:
        return "", []

    documents = results["documents"][0]
    metadatas = results["metadatas"][0] if results["metadatas"] else []
    distances = results["distances"][0] if results["distances"] else []

    relevant = []
    sources = []
    for doc, meta, dist in zip(documents, metadatas, distances):
        if dist < 1.5:
            relevant.append(doc)
            if meta and "source" in meta:
                sources.append(meta["source"])

    context = "\n\n".join(relevant) if relevant else ""
    return context, sources


@app.get("/health")
async def health():
    ollama_ok = False
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
            ollama_ok = r.status_code == 200
    except Exception:
        pass

    return {
        "status": "ok",
        "ollama": ollama_ok,
        "chroma_docs": collection.count(),
        "model": OLLAMA_MODEL,
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")

    rag_context, sources = query_rag(request.message)
    rag_used = bool(rag_context)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in request.history[-10:]:
        messages.append({"role": msg.role, "content": msg.content})

    user_content = request.message
    if rag_context:
        user_content = (
            f"Contexto de la base de datos sobre corrupción en Honduras:\n\n"
            f"{rag_context}\n\n"
            f"Pregunta del usuario: {request.message}"
        )

    messages.append({"role": "user", "content": user_content})

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "messages": messages,
                    "stream": False,
                },
                timeout=120,
            )
            response.raise_for_status()
            data = response.json()
            assistant_message = data["message"]["content"]
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error al conectar con Ollama: {e.response.status_code}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error al conectar con Ollama: {str(e)}",
        )

    return ChatResponse(
        response=assistant_message,
        sources=sources,
        rag_used=rag_used,
    )


@app.post("/ingest")
async def ingest_document(request: IngestRequest):
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="El contenido no puede estar vacío")

    doc_id = request.doc_id or f"doc_{collection.count() + 1}"

    chunks = []
    chunk_size = 500
    words = request.content.split()
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i : i + chunk_size])
        chunks.append(chunk)

    chunk_ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"source": request.metadata.get("source", "manual"), **request.metadata} for _ in chunks]

    try:
        collection.add(
            documents=chunks,
            ids=chunk_ids,
            metadatas=metadatas,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al indexar: {str(e)}")

    return {
        "ok": True,
        "doc_id": doc_id,
        "chunks_indexed": len(chunks),
        "total_docs": collection.count(),
    }


@app.get("/collections")
async def list_collections():
    return {
        "collections": [col.name for col in chroma_client.list_collections()],
        "corrupcion_hn_count": collection.count(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
