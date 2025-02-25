import React, { useEffect, useState } from 'react';
import '../../../styles/new-edit-form.css';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import trimFormValues from '../../../utils/trimFormValues';

const NewCustomer = () => {
  localStorage.setItem('selectedView', 'customers');
  const navigate = useNavigate();

  useEffect(() => {
    // Permission validation
    if (!userVerification().isAuthenticated) {
      localStorage.clear();
      navigate('/login');
      return;
    }
  }, [navigate]);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    document: '', // Previously "ID Document"
    address: '',
    state: '',
    city: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedFormData = trimFormValues(formData);

    setSubmitDisabled(true);
    try {
      const response = await fetch(`${API}/api/v1/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedFormData),
      });

      if (response.ok) {
        alert('Customer created successfully');
        navigate('/customers');
        return;
      }
      alert("Customer couldn't be created, check the information");
    } catch (error) {
      console.log(error);
      alert("Error creating customer");
    }
    setSubmitDisabled(false);
  }

  return (
    <div className="newCustomer-container">

      <div className="text">New Customer</div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="grid-form">
            <div className="form-item">
              <label htmlFor="name">Name</label>
              <input
                className="input"
                type="text"
                id="name"
                maxLength="45"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-item">
              <label htmlFor="document">ID Card</label>
              <input
                className="input"
                type="number"
                id="document"
                maxLength="45"
                value={formData.document}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-item">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                className="input"
                type="text"
                id="phoneNumber"
                maxLength="20"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-item">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                type="email"
                id="email"
                maxLength="100"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="two-together">
              <div className="form-item">
                <label htmlFor="state">State</label>
                <input
                  className="input"
                  type="text"
                  id="state"
                  maxLength="45"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="city">City</label>
                <input
                  className="input"
                  type="text"
                  id="city"
                  maxLength="45"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-item">
              <label htmlFor="address">Address</label>
              <input
                className="input"
                type="text"
                id="address"
                maxLength="100"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="button-container">
            <button className="btn" type="submit" disabled={submitDisabled}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCustomer;
