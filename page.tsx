'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

interface QuestionDraft {
  text: string;
  type: QuestionType;
  options: string[];
}

export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionDraft[]>([{ text: '', type: 'INPUT', options: [] }]);
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'INPUT', options: [] }]);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, data: Partial<QuestionDraft>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...data };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      alert('Please enter a quiz title');
      return;
    }

    const res = await fetch('http://localhost:4000/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions }),
    });

    if (res.ok) {
      alert('Quiz saved successfully!');
      router.push('/quizzes');
    } else {
      alert('Error: Could not save the quiz');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-5">Create Your New Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-bold">Quiz Title</label>
          <input
            required
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., General Knowledge"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          {questions.map((q, i) => (
            <div key={i} className="border p-4 rounded bg-gray-50 relative">
              <button
                type="button"
                onClick={() => deleteQuestion(i)}
                className="absolute top-2 right-2 text-red-600 font-bold"
              >
                X
              </button>
              <div className="mb-3">
                <label className="block text-sm mb-1">Question Text</label>
                <input
                  required
                  className="w-full border p-2 rounded"
                  value={q.text}
                  onChange={(e) => updateQuestion(i, { text: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  className="w-full border p-2 rounded"
                  value={q.type}
                  onChange={(e) => updateQuestion(i, { type: e.target.value as QuestionType })}
                >
                  <option value="BOOLEAN">Boolean (True/False)</option>
                  <option value="INPUT">Text Input</option>
                  <option value="CHECKBOX">Checkbox (Multiple Choice)</option>
                </select>
              </div>
              {q.type === 'CHECKBOX' && (
                <div className="mt-3">
                  <label className="block text-sm mb-1">Options (comma separated)</label>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Option A, Option B, Option C"
                    onChange={(e) => updateQuestion(i, { options: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="w-full border-2 border-dashed border-gray-300 p-2 rounded text-gray-600 hover:bg-gray-50"
        >
          + Add Question
        </button>

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700"
        >
          Save Quiz Now
        </button>
      </form>
    </div>
  );
}