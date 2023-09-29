import React, { useState } from "react";
import { FaStar } from "react-icons/fa";


 const RatingFunction = ({ selectedRating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);
  
    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star}>
            <input
              type="radio"
              name="rating"
              value={star}
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
            <FaStar
              className={
                star <= (hoverRating || selectedRating)
                  ? "star-icon selected"
                  : "star-icon"
              }
            />
          </label>
        ))}
      </div>
    );
  };
  export default RatingFunction;
  