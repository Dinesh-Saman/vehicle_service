import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faStar, faComment } from '@fortawesome/free-solid-svg-icons';
import './Pages/styles/FeedbackPage.css'; // Import custom styles

const FeedbackPage = () => {
  const feedbacks = [
    {
      name: 'John Doe',
      comment: 'Amazing service! My car has never felt better.',
      rating: 5,
      icon: faUserCircle,
      color: '#1e90ff', // Blue
    },
    {
      name: 'Jane Smith',
      comment: 'The technicians are highly skilled and friendly. Highly recommend!',
      rating: 4,
      icon: faUserCircle,
      color: '#ff6347', // Tomato
    },
    {
      name: 'Alice Johnson',
      comment: 'Fast and efficient service! I’m very satisfied.',
      rating: 5,
      icon: faUserCircle,
      color: '#32cd32', // Lime Green
    },
    {
      name: 'Michael Brown',
      comment: 'Great value for money. Will definitely return!',
      rating: 4,
      icon: faUserCircle,
      color: '#ffa500', // Orange
    },
    {
      name: 'Emily Davis',
      comment: 'Excellent customer service and knowledgeable staff.',
      rating: 5,
      icon: faUserCircle,
      color: '#ff69b4', // Hot Pink
    },
    {
      name: 'Chris Wilson',
      comment: 'I was impressed by the professionalism of the team.',
      rating: 4,
      icon: faUserCircle,
      color: '#8a2be2', // Blue Violet
    },
    {
      name: 'Jessica Miller',
      comment: 'Highly recommend this place for all your car needs!',
      rating: 5,
      icon: faUserCircle,
      color: '#ff4500', // Orange Red
    },
    {
      name: 'David Anderson',
      comment: 'Always satisfied with the service I receive here.',
      rating: 4,
      icon: faUserCircle,
      color: '#20b2aa', // Light Sea Green
    },
    {
      name: 'Sarah Thomas',
      comment: 'Reliable and honest service. Thank you!',
      rating: 5,
      icon: faUserCircle,
      color: '#4682b4', // Steel Blue
    },
    {
      name: 'Daniel Harris',
      comment: 'My go-to place for car repairs. Always a pleasure!',
      rating: 5,
      icon: faUserCircle,
      color: '#d2691e', // Chocolate
    },
  ];

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Customer Feedback</h1>
      <div className="row mt-4">
        {feedbacks.map((feedback, index) => (
          <div className="col-lg-4 col-md-6 mb-4" key={index}>
            <div className="feedback-card">
              <div className="feedback-icon">
                <FontAwesomeIcon icon={feedback.icon} size="3x" color={feedback.color} />
              </div>
              <h4 className="feedback-name">{feedback.name}</h4>
              <p className="feedback-comment">
                <FontAwesomeIcon icon={faComment} color={feedback.color} /> {feedback.comment}
              </p>
              <div className="feedback-rating">
                {Array.from({ length: feedback.rating }, (_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} color="#ffd700" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
