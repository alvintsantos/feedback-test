import React, { useState, useEffect, Fragment } from "react";
import FeedbackContent from "./FeedbackContent";
import Pagination from "./Pagination";
import FeedbackListHeader from "./FeedbackListHeader";
import FeedbackModal from "./FeedbackModal";
import axios from "axios";
import { API_URL } from "../config/config";

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
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [happinessFilter, setHappinessFilter] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFeedbacks = () => {
    setLoading(true);
    // Build query parameters for filtering and sorting
    const params = new URLSearchParams();
    
    if (ratingFilter !== null) {
      params.append('rating', ratingFilter.toString());
    }
    
    if (happinessFilter !== null) {
      params.append('happiness_level', happinessFilter.toString());
    }
    
    if (sortOrder) {
      params.append('sort', 'rating');
      params.append('order', sortOrder);
    }
    params.append('page', currentPage.toString());
    params.append('per_page', itemsPerPage.toString());
    
    // Make the API call with query parameters
    axios.get(`${API_URL}/feedback?${params.toString()}`)
      .then(response => {
        setFeedbacklist(response.data.data);
        setTotalFeedbacks(response.data.total);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the feedbacks!", error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [ratingFilter, happinessFilter, sortOrder, currentPage]); // Re-fetch when filter, sort, or page changes

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetchFeedbacks will be called by the useEffect due to dependency on currentPage
  };

  const openFeedbackModal = () => {
    setIsModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsModalOpen(false);
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
        fetchFeedbacks={fetchFeedbacks}
        openFeedbackModal={openFeedbackModal}
      />
      {!loading && !error && feedbacklist.length > 0 && (
        <div className="col-md-12 text-muted text-right pull-right mb-2">
          Displaying {feedbacklist.length} out of {totalFeedbacks} feedbacks
        </div>
      )}
      {loading && <div className="alert alert-info">Loading feedbacks...</div>}
      {error && <div className="alert alert-danger">Error loading feedbacks</div>}
      {!loading && !error && feedbacklist.length === 0 && <div className="alert alert-danger">No feedbacks found</div>}
      
      {!loading && !error && feedbacklist.length > 0 && (
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
        onFeedbackSubmitted={fetchFeedbacks} 
      />
    </Fragment>
  );
}

export default Feedbacks;
