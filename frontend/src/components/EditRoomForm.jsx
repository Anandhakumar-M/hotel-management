import { useState, useEffect } from 'react';
import './EditRoomForm.css';

const EditRoomForm = ({ room, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'standard',
    price: 0,
    capacity: 1,
    amenities: [],
    available: true,
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number || '',
        type: room.type || 'standard',
        price: room.price || 0,
        capacity: room.capacity || 1,
        amenities: room.amenities || [],
        available: room.available !== undefined ? room.available : true,
        image: room.image || ''
      });
    }
  }, [room]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Room number is required';
    }

    if (!formData.type) {
      newErrors.type = 'Room type is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...room,
        ...formData
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-room-form">
      <div className="form-group">
        <label htmlFor="number">Room Number</label>
        <input
          type="text"
          id="number"
          value={formData.number}
          onChange={(e) => handleInputChange('number', e.target.value)}
          className={errors.number ? 'error' : ''}
        />
        {errors.number && <span className="error-text">{errors.number}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="type">Room Type</label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className={errors.type ? 'error' : ''}
        >
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
        {errors.type && <span className="error-text">{errors.type}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="price">Price per Night (₹)</label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
          min="0"
          step="0.01"
          className={errors.price ? 'error' : ''}
        />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacity (Guests)</label>
        <input
          type="number"
          id="capacity"
          value={formData.capacity}
          onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
          min="1"
          max="10"
          className={errors.capacity ? 'error' : ''}
        />
        {errors.capacity && <span className="error-text">{errors.capacity}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="image">Image URL</label>
        <input
          type="url"
          id="image"
          value={formData.image}
          onChange={(e) => handleInputChange('image', e.target.value)}
          placeholder="https://example.com/room-image.jpg"
          className={errors.image ? 'error' : ''}
        />
        {errors.image && <span className="error-text">{errors.image}</span>}
        {formData.image && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={formData.image} 
              alt="Room preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '150px', 
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Amenities</label>
        <div className="amenities-input">
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            placeholder="Add an amenity..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
          />
          <button type="button" onClick={handleAddAmenity} className="btn-small">
            Add
          </button>
        </div>
        <div className="amenities-list">
          {formData.amenities.map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
              <button
                type="button"
                onClick={() => handleRemoveAmenity(amenity)}
                className="amenity-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => handleInputChange('available', e.target.checked)}
          />
          Available for booking
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditRoomForm; 