import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../services/firebase'; // Assuming auth is needed for uploaderId
import { useAuth } from '../../contexts/AuthContext';

function UploadPaperPage() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [examName, setExamName] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }
    if (!currentUser) {
        setError('You must be logged in to upload.');
        return;
    }

    setError('');
    setSuccess('');
    setUploading(true);
    setProgress(0);

    try {
      // 1. Upload file to Cloud Storage
      const storageRef = ref(storage, `question_papers/${examName}/${year}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(prog);
        },
        (err) => {
          console.error("Upload error:", err);
          setError(`File upload failed: ${err.message}`);
          setUploading(false);
        },
        async () => {
          // 2. Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // 3. Add paper metadata to Firestore
          await addDoc(collection(db, 'questionPapers'), {
            title,
            year: parseInt(year), // Ensure year is a number if you plan to sort/filter by it numerically
            subject,
            examName,
            downloadURL,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploaderId: currentUser.uid,
            uploadedAt: serverTimestamp(),
            isPublished: false, // Default to not published, admin can publish later
            // Add other metadata like university/board, description, tags etc.
          });

          setSuccess('Question paper uploaded successfully!');
          setTitle('');
          setYear('');
          setSubject('');
          setExamName('');
          setFile(null);
          document.getElementById('fileInput').value = null; // Reset file input
          setUploading(false);
        }
      );
    } catch (err) {
      console.error("Error adding document:", err);
      setError(`Failed to upload paper details: ${err.message}`);
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload New Question Paper</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Year (e.g., 2023):</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
        </div>
        <div>
          <label>Subject (e.g., Physics):</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div>
          <label>Exam Name (e.g., JEE Main, UPSC):</label>
          <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} required />
        </div>
        <div>
          <label>Paper PDF:</label>
          <input id="fileInput" type="file" accept="application/pdf" onChange={handleFileChange} required />
        </div>
        {uploading && <p>Uploading: {progress}%</p>}
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Paper'}
        </button>
      </form>
    </div>
  );
}

export default UploadPaperPage;
