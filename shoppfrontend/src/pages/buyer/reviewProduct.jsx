import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "../../components/user/header";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import RatingFunction from "../../components/user/ratingUtils.jsx"
import { NotFound } from "../user/notFound";
import * as Icon from "react-bootstrap-icons"

export const ReviewProduct = () => {
  const [userRole, setRole] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("loginFormData");
    if (user) {
      const parsedUser = JSON.parse(user);
      setRole(parsedUser.role)
    }
  }, []);

  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const sessionUser = JSON.parse(sessionStorage.getItem("loginFormData"));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setReviewImage(imageFile);

    if (imageFile) {
      const imageURL = URL.createObjectURL(imageFile);
      setImagePreview(imageURL);
    }
  };

  const handleCancleImage = (event) => {
    setReviewImage(null);
    setImagePreview(null);
  }

  const renderStars = () => {
    const maxRating = 5;
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span
          key={i} 
          className={`star display-6 ${i <= selectedRating ? " text-warning" : ""}`}
          onClick={() => handleRatingChange(i)}
        >
          <Icon.StarFill />
        </span>
      );
    }
    return stars;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("rating", selectedRating);
    formData.append("comment", comment);
    formData.append("reviewImage", reviewImage);

    axios
      .post(
        `http://localhost:8080/shop/review?productId=${productId}&email=${sessionUser.email}`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data", 
          },
        }
      )
      .then((response) => {
        // Handle the response as needed
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Review Submitted",
          text: "Thank you for submitting!",
          preConfirm: () => {
            return new Promise(() => {
             window.location.replace(`productDetails/${productId}`);
            });
          },
        });
      })
      .catch((error) => {
        if (error.response.data.message === 'Already reviewed.') {
          Swal.fire({
            icon: 'success',
            title: 'Already reviewed',
            text: 'You have already reviewed this product',
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Review Submission Failed",
            text: "There was an error submitting your review.",
          });
        }
        console.error(error);
        
      });
  };

  useEffect(() => {
    // Make an API request to fetch the product details based on the productId
    axios
      .get(`http://localhost:8080/shop/product/${productId}`, { headers })
      .then((response) => {
        console.log(response.data)
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Header activePage={""} />
        {userRole === "BUYER" && (
      <div className="body">
        <div className="col-12 d-flex justify-content-center">

        {product && (
              <>
          <div className="col-7 loginBox">
            <div className="d-flex justify-content-center">
            <img src={`data:image/jpeg;base64,${product.productImage}`} alt="" className="col-6 rounded-5" />
            </div>
          <Form className="mt-3">
            <Form.Group controlId="rating">
              <p className="lead text-center">How much are you satisfied on <span className="fw-bold">{product.productName}</span>?</p>
              <div className="star-rating text-center">{renderStars()}</div>
            </Form.Group>




          <Form.Floating controlId="comment" className="mt-5">
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              style={{height:"200px"}}
              placeholder="What are your thoughts on this product?"
              onChange={(e) => setComment(e.target.value)}
            />
            <label>What are your thoughts on this product?</label>

          </Form.Floating>


          {imagePreview &&
          <div className="d-flex justify-content-center mt-5">
            <div className="col-11 mx-auto">
              <div className="d-flex">
              <p className="lead mb-2 col-11"> {reviewImage.name.toString()} </p>
              <Icon.X  className="display-6 text-center col-1 mb-1" onClick={handleCancleImage}/>
              </div>
            <img src={imagePreview} style={{scale:"80%"}} className="col-12 rounded-5" alt="Preview" />
            </div>
          </div>
        }
          <Form.Group controlId="reviewImage" className="mt-5">
            <Form.Label>Upload a photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-center mt-5">
          <Button variant="" className="col-6 btnOren" type="submit" onClick={handleSubmit}>
            Submit <Icon.Send />
          </Button>
          </div>
          
        </Form>
          </div>
            </>
            )}
        </div>
      </div>
        )}
    
        {userRole !== "BUYER" && (
                <NotFound />
            )}
    </>
  );
};
