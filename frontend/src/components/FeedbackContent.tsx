import React from "react";
import moment from "moment";
import { HAPPINESS_EMOJIS } from "../config/config";

interface FeedbackProps {
  feedbackObject: {
    id: number;
    customer_name: string;
    rating: number;
    message: string;
    created_at: string;
    happiness_level?: number;
  }
}

const FeedbackContent: React.FC<FeedbackProps> = ({ feedbackObject }) => {
  const happinessLevel = feedbackObject.happiness_level || 3;
  const happinessEmoji = HAPPINESS_EMOJIS[happinessLevel - 1];
  
  return (
    <div>
      <h5>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(183, 183, 183, 0.34)', padding: '10px', width: '30px', height: '30px' }}>
          <span style={{ fontSize: '1.2rem' }}>{happinessEmoji}</span>
        </span> 
        &nbsp;{feedbackObject.customer_name}
      </h5>
      <div>
        Rating: {Array.from({ length: 5 }, (_, index) => (
          <span key={index} style={{ color: index < feedbackObject.rating ? 'gold' : 'gray' }}>
            &#9733;
          </span>
        ))}
      </div>
      <p>{feedbackObject.message}</p>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-muted" title={moment(feedbackObject.created_at).format('MMMM DD, YYYY [at] HH:mm:ss')}>
        <i className="fas fa-sm fa-calendar"></i> {moment(feedbackObject.created_at).format('MMM DD, YYYY')}  {moment(feedbackObject.created_at).fromNow()}
        </small>
        <small className="text-muted">
        </small>
      </div>
    </div>
  );
};

export default FeedbackContent;

