import axios from "axios";
import { API_URL } from "../config/config";

interface Feedback {
  id: number;
  customer_name: string;
  rating: number;
  message: string;
  created_at: string;
  happiness_level?: number;
}

interface FeedbackResponse {
  data: Feedback[];
  total: number;
}

export interface ValidationError {
  message: string;
  errors?: Record<string, string[]>;
}

export const fetchFeedbacks = async (
  ratingFilter: number | null,
  happinessFilter: number | null,
  sortOrder: string,
  currentPage: number,
  itemsPerPage: number
): Promise<FeedbackResponse> => {
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
  
  try {
    // Make the API call with query parameters
    const response = await axios.get(`${API_URL}/feedback?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the feedbacks!", error);
    
    // Extract validation errors if they exist
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      if (status === 422 && responseData.errors) {
        // Laravel validation errors
        const validationError: ValidationError = {
          message: responseData.message || 'Validation failed',
          errors: responseData.errors
        };
        throw validationError;
      }
    }
    throw error;
  }
};

export const submitFeedback = async (
  feedbackData: Omit<Feedback, 'id' | 'created_at'>
): Promise<{ message: string; data: Feedback }> => {
  try {
    const response = await axios.post(`${API_URL}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error("There was an error submitting feedback!", error);
    
    // Extract validation errors if they exist
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      if (status === 422 && responseData.errors) {
        // Laravel validation errors
        const validationError: ValidationError = {
          message: responseData.message || 'Validation failed',
          errors: responseData.errors
        };
        throw validationError;
      }
    }
    throw error;
  }
}; 