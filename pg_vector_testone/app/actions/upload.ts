'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function uploadDocument(formData: FormData) {
    const file = formData.get("file") as File;
    if(!file) throw new Error ("No File uploaded...");

    const text = await file.text();

    const model = genAI.getGenerativeModel({ model: "" });
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    const vectorStrings = `[${embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(`INSERT INTO "Document" (id, content, embedding) VALUES (gen_random_uuid(), $1, $2::vector)`, text, vectorStrings);
    return { success: true};
}