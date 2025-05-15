import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

function QuestionPapersPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError('');
      try {
        // Query only published papers
        const papersQuery = query(
            collection(db, 'questionPapers'),
            where('isPublished', '==', true), // Ensure you have this field
            orderBy('year', 'desc'), // Example ordering
            orderBy('title', 'asc')
        );
        const querySnapshot = await getDocs(papersQuery);
        const papersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPapers(papersList);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError('Failed to load question papers.');
      }
      setLoading(false);
    };

    fetchPapers();
  }, []);

  if (loading) return <p>Loading papers...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Question Papers</h2>
      {papers.length === 0 ? (
        <p>No question papers available at the moment.</p>
      ) : (
        <ul>
          {papers.map(paper => (
            <li key={paper.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{paper.title} ({paper.year})</h3>
              <p>Subject: {paper.subject}</p>
              <p>Exam: {paper.examName}</p>
              {paper.downloadURL && (
                <a href={paper.downloadURL} target="_blank" rel="noopener noreferrer">
                  Download PDF
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* Add search and filter UI here later */}
    </div>
  );
}

export default QuestionPapersPage;
