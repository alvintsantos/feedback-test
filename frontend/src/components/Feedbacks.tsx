import React, { useState, useEffect, Fragment } from "react";
import FeedbackContent from "./FeedbackContent";
import Pagination from "./Pagination";
import FeedbackListHeader from "./FeedbackListHeader";
import FeedbackModal from "./FeedbackModal";
import { fetchFeedbacks, ValidationError } from "../services/feedbackService";

interface Feedback {
  id: number;
  customer_name: string;
  rating: number;
  message: string;
  created_at: string;
  happiness_level?: number; // Optional for backward compatibility with existing data
}

function Feedbacks() {
  const [feedbacklist, setFeedbacklist] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [happinessFilter, setHappinessFilter] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFeedbacks = () => {
    setLoading(true);
    setError(null);
    setValidationErrors(null);
    
    fetchFeedbacks(ratingFilter, happinessFilter, sortOrder, currentPage, itemsPerPage)
      .then(response => {
        setFeedbacklist(response.data);
        setTotalFeedbacks(response.total);
        setLoading(false);
      })
      .catch(err => {
        console.error("There was an error fetching the feedbacks!", err);
        
        if ((err as ValidationError).errors) {
          // Handle validation errors
          setValidationErrors((err as ValidationError).errors || {});
          setError((err as ValidationError).message || 'Invalid filters');
        } else {
          setError('Failed to load feedbacks. Please try again.');
        }
        
        setLoading(false);
      });
  };

  useEffect(() => {
    getFeedbacks();
  }, [ratingFilter, happinessFilter, sortOrder, currentPage]); // Re-fetch when filter, sort, or page changes

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // getFeedbacks will be called by the useEffect due to dependency on currentPage
  };

  const openFeedbackModal = () => {
    setIsModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsModalOpen(false);
  };

  const renderValidationErrors = () => {
    if (!validationErrors) return null;
    
    return (
      <div className="alert alert-danger">
        <strong>Validation Error:</strong>
        <ul className="mb-0 mt-1">
          {Object.entries(validationErrors).map(([field, messages]) => (
            <li key={field}>{field}: {messages[0]}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Fragment>
      <FeedbackListHeader
        loading={loading}
        ratingFilter={ratingFilter}
        happinessFilter={happinessFilter}
        sortOrder={sortOrder}
        setRatingFilter={setRatingFilter}
        setHappinessFilter={setHappinessFilter}
        setSortOrder={setSortOrder}
        setCurrentPage={setCurrentPage}
        fetchFeedbacks={getFeedbacks}
        openFeedbackModal={openFeedbackModal}
      />
      {!loading && !error && !validationErrors && feedbacklist.length > 0 && (
        <div className="col-md-12 text-muted text-right pull-right mb-2">
          Displaying {feedbacklist.length} out of {totalFeedbacks} feedbacks
        </div>
      )}
      {loading && <div className="alert alert-info">Loading feedbacks...</div>}
      {error && !validationErrors && <div className="alert alert-danger">{error}</div>}
      {validationErrors && renderValidationErrors()}
      {!loading && !error && !validationErrors && feedbacklist.length === 0 && (
        <div className="alert alert-danger">No feedbacks found</div>
      )}
      
      {!loading && !error && !validationErrors && feedbacklist.length > 0 && (
        <>
          <ul className="list-group">
            {feedbacklist.map((feedback) => (  
              <li 
                className="list-group-item" 
                key={feedback.id}>
                <FeedbackContent feedbackObject={feedback} />
              </li>
            ))}
          </ul>
          
          <div className="mt-4">
            <Pagination 
              currentPage={currentPage}
              totalItems={totalFeedbacks}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
      
      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={closeFeedbackModal} 
        onFeedbackSubmitted={getFeedbacks} 
      />
    </Fragment>
  );
}

export default Feedbacks;
