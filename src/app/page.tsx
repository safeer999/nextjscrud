'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiBase = 'https://api.aethondigital.com/api/users'; // Your Laravel API URL

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editUser, setEditUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchId, setSearchId] = useState(''); // State for user ID search input

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(apiBase);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`${apiBase}/${id}`, {
          method: 'DELETE',
        });
        fetchUsers();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const findUserById = async (id: number) => {
    try {
      const response = await fetch(`${apiBase}/${id}`);
      const data = await response.json();
      setSelectedUser(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('User not found:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value); // Update search input
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (searchId) {
      findUserById(parseInt(searchId)); // Fetch user by ID
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    if (!editUser?.id) return;
    try {
      await fetch(`${apiBase}/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUser),
      });
      setEditUser(null);
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Users</h2>

      {/* Search Input */}
      <Form onSubmit={handleSearchSubmit} className="mb-4">
        <Form.Group controlId="searchUserId" className="d-flex">
          <Form.Control
            type="text"
            placeholder="Enter User ID"
            value={searchId}
            onChange={handleSearchChange}
          />
          <Button type="submit" variant="primary" className="ms-2">
            Search
          </Button>
        </Form.Group>
      </Form>

      {/* React-Bootstrap Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => findUserById(user.id)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setEditUser(user);
                    setShowEditModal(true);
                  }}
                  className="ms-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* View User Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Password:</strong> {selectedUser.password}</p>
              <p><strong>Remember Token:</strong> {selectedUser.rememberToken}</p>
            </>
          ) : (
            <p>No user selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editUser && (
            <>
              <Form.Group className="mb-3" controlId="editName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editUser.name || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editUser.email || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={editUser.phone || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={editUser.address || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={editUser.password || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
