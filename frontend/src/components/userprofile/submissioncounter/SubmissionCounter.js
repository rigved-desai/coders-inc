import React from 'react';
import './SubmissionCounter.css'; // Make sure to update the CSS filename accordingly

const SubmissionCounter = ({ numberOfSubmissions }) => {
  return (
    <div className="submission-counter">
      <div className="submission-counter-top">
        Number of Submissions
      </div>
      <div className="submission-counter-bottom">
        {numberOfSubmissions}
      </div>
    </div>
  );
};

export default SubmissionCounter;
