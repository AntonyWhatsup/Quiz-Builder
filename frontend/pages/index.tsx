import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface QuizItem {
  id: string;
  title: string;
  createdAt: string;
  _count: { questions: number };
}

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/quizzes')
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quiz?')) return;
    await fetch(`http://localhost:4000/quizzes/${id}`, { method: 'DELETE' });
    setQuizzes((s) => s.filter((q) => q.id !== id));
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Quizzes</h1>
        <Link href="/create" style={{ padding: '0.6rem 1.05rem', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter, system-ui' }}>Create Quiz</Link>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quizzes.map((q) => (
            <li key={q.id} style={{ padding: '1rem', border: '1px solid #e6edf3', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(15,23,42,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
              <div>
                <Link href={`/quizzes/${q.id}`} style={{ fontWeight: 600, fontSize: '1.125rem', textDecoration: 'none', color: '#0f172a' }}>{q.title || 'Untitled Quiz'}</Link>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{q._count?.questions ?? 0} questions</div>
              </div>
              <div>
                <button onClick={() => handleDelete(q.id)} style={{ background: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
