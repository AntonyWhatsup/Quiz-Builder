import React, { useState } from 'react';
import { useRouter } from 'next/router';

type QType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

interface QuestionForm {
  id: string;
  text: string;
  type: QType;
  options: string[];
}

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { id: Date.now().toString(), text: '', type: 'INPUT', options: [] },
  ]);

  const addQuestion = () => {
    setQuestions((s) => [...s, { id: Date.now().toString(), text: '', type: 'INPUT', options: [] }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((s) => s.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, patch: Partial<QuestionForm>) => {
    setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation: title required and each question must have text
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    for (const q of questions) {
      if (!q.text.trim()) {
        alert('Please fill in all question texts');
        return;
      }
      if (q.type === 'CHECKBOX' && q.options.length === 0) {
        alert('Checkbox questions require at least one option');
        return;
      }
    }

    const payload = {
      title: title.trim(),
      questions: questions.map((q) => ({ text: q.text.trim(), type: q.type, options: q.options })),
    };
    const res = await fetch('http://localhost:4000/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to create quiz');
    }
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1.5rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create Quiz</h1>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" style={{ width: '100%', border: '1px solid #e6edf3', padding: '10px', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.map((q, idx) => (
            <div key={q.id} style={{ padding: '1rem', border: '1px solid #e6edf3', borderRadius: '8px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600 }}>Question {idx + 1}</div>
                <button type="button" onClick={() => removeQuestion(q.id)} style={{ background: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Remove</button>
              </div>
              <input placeholder="Question text" value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} type="text" style={{ width: '100%', border: '1px solid #e6edf3', padding: '10px', borderRadius: '8px', marginBottom: '0.75rem', boxSizing: 'border-box', fontFamily: 'Inter, system-ui' }} />
              <select value={q.type} onChange={(e) => updateQuestion(q.id, { type: e.target.value as QType })} style={{ width: '100%', border: '1px solid #e6edf3', padding: '10px', borderRadius: '8px', marginBottom: '0.75rem', boxSizing: 'border-box', fontFamily: 'Inter, system-ui' }}>
                <option value="INPUT">Input</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="CHECKBOX">Checkbox</option>
              </select>

              {q.type === 'CHECKBOX' && (
                <div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Options (one per line)</div>
                  <textarea value={q.options.join('\n')} onChange={(e) => updateQuestion(q.id, { options: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })} style={{ width: '100%', border: '1px solid #e6edf3', padding: '10px', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui' }} rows={4} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" onClick={addQuestion} style={{ padding: '0.6rem 1.05rem', background: '#f3f4f6', color: '#0f172a', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, system-ui' }}>Add Question</button>
          <button type="submit" style={{ padding: '0.6rem 1.05rem', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, system-ui' }}>Create Quiz</button>
        </div>
      </form>
    </div>
  );
}
