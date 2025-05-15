import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboardPage() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>
      <ul>
        <li><Link to="/admin/upload-paper">Upload New Question Paper</Link></li>
        {/* Add links to manage papers, exams, users, view analytics etc. */}
        <li>Manage Question Papers (Not Implemented)</li>
        <li>Manage Exams (Not Implemented)</li>
        <li>User Management (Not Implemented)</li>
      </ul>
    </div>
  );
}

export default AdminDashboardPage;
