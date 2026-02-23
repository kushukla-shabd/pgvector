'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function uploadDocument(formData: FormData) {
    const file = formData.get("file") as File;
    if(!file) throw new Error ("No File uploaded...");

    const text = await file.text();

    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    const vectorStrings = `[${embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(`INSERT INTO "Document" (id, content, embedding) VALUES (gen_random_uuid(), $1, $2::vector)`, text, vectorStrings);
    return { success: true};
}

export async function askQuestion(question: string) {
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embedResult = await embedModel.embedContent(question);
    const questionEmbedding = `[${embedResult.embedding.values.join(",")}]`;

    const results: any[] = await prisma.$queryRawUnsafe(`SELECT content, 1 - (embedding <=> $1::vector) as similarity from "Document" ORDER BY embedding <=> $1::vector ASC LIMIT 3`, questionEmbedding);
    const context = results.map(r => r.content).join("\n\n");

    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite"});
    const prompt = `You are a helpful assistant. Use the following poece of context to answer the question. If you don't know the answer based on the context, say you don't know. CONTEXT: ${context} QUESTION: ${question}`;
    const chatResult = await chatModel.generateContent(prompt);
    return { answer: chatResult.response.text()};
    
}