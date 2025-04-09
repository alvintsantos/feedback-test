import React from 'react';
import { HAPPINESS_EMOJIS, HAPPINESS_LABELS } from '../config/config';

interface FeedbackListHeaderProps {
  loading: boolean;
  ratingFilter: number | null;
  happinessFilter: number | null;
  sortOrder: string;
  setRatingFilter: (rating: number | null) => void;
  setHappinessFilter: (happiness: number | null) => void;
  setSortOrder: (order: string) => void;
  setCurrentPage: (page: number) => void;
  fetchFeedbacks: () => void;
  openFeedbackModal: () => void;
}

const FeedbackListHeader: React.FC<FeedbackListHeaderProps> = ({
  loading,
  ratingFilter,
  happinessFilter,
  sortOrder,
  setRatingFilter,
  setHappinessFilter,
  setSortOrder,
  setCurrentPage,
  fetchFeedbacks,
  openFeedbackModal
}) => {
  return (
    <div className="d-flex justify-content-between feedback-list-header align-items-center mb-4">
      <div className="d-flex align-items-center">
        <h2 className="text-dark" style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '15px' }}>Feedbacks List</h2>
        <button 
          className="btn btn-sm btn-outline-primary d-flex align-items-center" 
          onClick={fetchFeedbacks}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-1"></i>
        </button>
      </div>
      <div className="d-flex gap-3 align-items-center">
        <div>
          <label htmlFor="filterRating" className="mr-2">Filter by Rating: &nbsp;</label>
          <select 
            id="filterRating" 
            onChange={(e) => {
              setRatingFilter(e.target.value === "" ? null : parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            value={ratingFilter === null ? "" : ratingFilter}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Ratings</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterHappiness" className="mr-2">Filter by Happiness: &nbsp;</label>
          <select 
            id="filterHappiness" 
            onChange={(e) => {
              setHappinessFilter(e.target.value === "" ? null : parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            value={happinessFilter === null ? "" : happinessFilter}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Levels</option>
            {HAPPINESS_EMOJIS.map((emoji, index) => (
              <option key={index} value={index + 1}>
                {emoji} Level {index + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sortRating" className="mr-2">Sort by Rating: &nbsp;</label>
          <select 
            id="sortRating" 
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1); // Reset to first page when sort changes
            }}
            disabled={ratingFilter !== null}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">No Sorting</option>
            <option value="desc">Highest Rating First</option>
            <option value="asc">Lowest Rating First</option>
          </select>
        </div>
        <button 
          className="btn btn-primary ms-3" 
          onClick={openFeedbackModal}
        >
          <i className="fas fa-plus me-1"></i> Add Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackListHeader; 