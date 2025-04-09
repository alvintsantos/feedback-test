import React, { useState } from 'react';
import { HAPPINESS_EMOJIS, HAPPINESS_LABELS } from '../config/config';
import { submitFeedback, ValidationError } from '../services/feedbackService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted: () => void;
}

interface ValidationErrors {
  [key: string]: string[];
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onClose,
  onFeedbackSubmitted 
}) => {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [happiness, setHappiness] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors(null);

    try {
      await submitFeedback({
        customer_name: customerName,
        rating,
        message,
        happiness_level: happiness
      });
      
      // Reset form
      setCustomerName('');
      setRating(5);
      setMessage('');
      setHappiness(3);
      
      // Close modal and refresh list
      onFeedbackSubmitted();
      onClose();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      
      if ((err as ValidationError).errors) {
        // Handle validation errors
        setValidationErrors((err as ValidationError).errors || {});
        setError((err as ValidationError).message || 'Validation failed. Please check the form fields.');
      } else {
        setError('There was an error submitting your feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleHappinessChange = (level: number) => {
    setHappiness(level);
  };

  const getFieldErrorMessage = (fieldName: string): string | null => {
    if (!validationErrors || !validationErrors[fieldName]) return null;
    return validationErrors[fieldName][0];
  };

  const getInputClassName = (fieldName: string): string => {
    return `form-control ${getFieldErrorMessage(fieldName) ? 'is-invalid' : ''}`;
  };

  return (
    <div className="modal-wrapper" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
      <div className="modal show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Feedback</h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className={getInputClassName('customer_name')}
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                  {getFieldErrorMessage('customer_name') && (
                    <div className="invalid-feedback">
                      {getFieldErrorMessage('customer_name')}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        style={{ 
                          cursor: 'pointer', 
                          color: star <= rating ? 'gold' : 'gray',
                          fontSize: '1.5rem',
                          margin: '0 2px'
                        }}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                  {getFieldErrorMessage('rating') && (
                    <div className="text-danger small mt-1">
                      {getFieldErrorMessage('rating')}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Your Feedback</label>
                  <textarea 
                    className={getInputClassName('message')}
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  {getFieldErrorMessage('message') && (
                    <div className="invalid-feedback">
                      {getFieldErrorMessage('message')}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">How happy are you with this app?</label>
                  <div className="happiness-scale d-flex justify-content-center align-items-center">
                    {HAPPINESS_EMOJIS.map((emoji, index) => (
                      <span 
                        key={index}
                        onClick={() => handleHappinessChange(index + 1)}
                        style={{ 
                          cursor: 'pointer', 
                          opacity: index + 1 === happiness ? 1 : 0.5,
                          fontSize: '1.8rem',
                          margin: '0 8px',
                          transform: index + 1 === happiness ? 'scale(1.2)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                          padding: '5px',
                          borderRadius: '50%',
                          backgroundColor: index + 1 === happiness ? 'rgba(0, 123, 255, 0.1)' : 'transparent'
                        }}
                        title={`Happiness level ${index + 1}`}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  {getFieldErrorMessage('happiness_level') && (
                    <div className="text-danger small mt-1 text-center">
                      {getFieldErrorMessage('happiness_level')}
                    </div>
                  )}
                  <div className="d-flex justify-content-between mt-1 px-2 text-muted" style={{ fontSize: '0.8rem' }}>
                    <span>{HAPPINESS_LABELS.min}</span>
                    <span>{HAPPINESS_LABELS.max}</span>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={isSubmitting || !customerName || !message}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  );
};

export default FeedbackModal; 