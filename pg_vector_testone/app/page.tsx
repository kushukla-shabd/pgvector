"use client";

import { useState } from "react";
import { uploadDocument, askQuestion } from "./actions/upload";

export default function RAGPage() {
  // States for Upload
  const [uploadStatus, setUploadStatus] = useState("");
  
  // States for Chat
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Handle File Upload
  async function handleUpload(formData: FormData) {
    setUploadStatus("Uploading...");
    const res = await uploadDocument(formData);
    setUploadStatus(res.success ? "Ready for questions!" : "Upload failed.");
  }

  // 2. Handle Asking Questions
  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setChatHistory(prev => [...prev, { role: "user", content: query }]);
    
    const res = await askQuestion(query);
    
    setChatHistory(prev => [...prev, { role: "assistant", content: res.answer }]);
    setQuery("");
    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar: Upload & Status */}
      <aside className="w-80 border-r bg-white p-6 flex flex-col gap-6">
        <h1 className="font-bold text-xl">Gemini RAG</h1>
        
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Knowledge Base</h2>
          <form action={handleUpload} className="space-y-2">
            <input 
              type="file" name="file" accept=".txt" 
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition">
              Process Document
            </button>
          </form>
          {uploadStatus && <p className="text-xs text-center text-blue-600 font-medium">{uploadStatus}</p>}
        </div>
      </aside>

      {/* Main: Chat Interface */}
      <main className="flex-grow flex flex-col">
        {/* Chat Log */}
        <div className="flex-grow overflow-y-auto p-8 space-y-4">
          {chatHistory.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-400">
              Upload a document to start asking questions.
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-white border-t">
          <form onSubmit={handleChat} className="max-w-3xl mx-auto flex gap-4">
            <input 
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="What does the document say about..."
              className="flex-grow p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button disabled={loading} className="bg-slate-900 text-white px-6 rounded-xl hover:bg-slate-800 disabled:opacity-50">
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}