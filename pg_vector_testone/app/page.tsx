'use client'

import { uploadDocument } from "./actions/upload";
import { useState } from "react";

export default function UploadPage() {
  const [status, setStatus] = useState<string>("");

  async function handleAction(formData: FormData) {
    setStatus("Uploading and generating embeddings.....");
    try {
      await uploadDocument(formData);
      setStatus("Success! Document stroed in pgvector...");
    }
    catch (error) {
      setStatus("Error uploading file..");
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-2xl font-bold mb-4">Document Uploader</h1>
        <form action={handleAction} className="space-y-4 border p-8 rounded-lg">
          <div>
            <label className="block mb-2 font-medium">Select file</label>
            <input
              type="file"
              name="file"
              accept=".txt"
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Upload
          </button>
        </form>

        {status && (<p className="mt-4 p-4 bg-gray-100 rounded text-center">{status}</p>)}
      </div>
    </main>
  );
}