// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface StudyPackage {
  summary: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export async function generateStudyMaterials(text: string, gradeLevel: string = "college"): Promise<StudyPackage> {
  const response = await fetch(`${API_BASE_URL}/api/generate-study-materials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      target_grade_level: gradeLevel,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate study materials from server.");
  }

  return response.json();
}