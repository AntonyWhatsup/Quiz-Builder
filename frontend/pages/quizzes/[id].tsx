import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Question {
  id: string;
  text: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  options: string | null;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export default function QuizDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleChange = (qid: string, value: any) => {
    setAnswers((s) => ({ ...s, [qid]: value }));
  };

  const submitAnswers = () => {
    console.log('Submitted answers', answers);
    alert('Answers submitted (preview) — check console for values');
  };

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/quizzes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Quiz not found');
        return res.json();
      })
      .then(setQuiz)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div style={{ padding: '2.5rem', color: '#dc2626', textAlign: 'center', fontWeight: 700 }}>{error}</div>;
  if (!quiz) return <div style={{ padding: '2.5rem', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '2.5rem' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '1.25rem', background: 'transparent', color: '#2563eb', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, system-ui' }}>
        ← Back to Quizzes
      </button>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem', borderBottom: '1px solid #e6edf3', paddingBottom: '1rem' }}>{quiz.title}</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={submitAnswers} style={{ padding: '0.6rem 1.05rem', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, system-ui' }}>Submit Answers</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {quiz.questions.map((q, index) => (
          <div key={q.id} style={{ border: '1px solid #e6edf3', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <p style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>{index + 1}. {q.text}</p>

            {q.type === 'BOOLEAN' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" name={q.id} style={{ marginRight: '0.5rem', cursor: 'pointer' }} onChange={() => handleChange(q.id, true)} /> True
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" name={q.id} style={{ marginRight: '0.5rem', cursor: 'pointer' }} onChange={() => handleChange(q.id, false)} /> False
                </label>
              </div>
            )}

            {q.type === 'INPUT' && (
              <input
                type="text"
                placeholder="Short answer text"
                style={{ width: '100%', border: '1px solid #e6edf3', padding: '10px', borderRadius: '8px', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui', boxSizing: 'border-box' }}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === 'CHECKBOX' && q.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(() => {
                  try {
                    const parsedOptions = JSON.parse(q.options);
                    if (!Array.isArray(parsedOptions)) return null;
                    return parsedOptions.map((opt: string, i: number) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ marginRight: '0.5rem', cursor: 'pointer' }} onChange={(e) => {
                          const current = answers[q.id] ?? [];
                          const next = e.target.checked ? [...current, opt] : current.filter((o: string) => o !== opt);
                          handleChange(q.id, next);
                        }} /> {opt}
                      </label>
                    ));
                  } catch (e) {
                    console.error('Failed to parse options for question:', q.id);
                    return <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>Error loading options</p>;
                  }
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
