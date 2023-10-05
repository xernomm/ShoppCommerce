import { Button, Spinner } from "react-bootstrap"
import * as Icon from "react-bootstrap-icons"
import { useParams } from 'react-router-dom';
import React, {useState, useEffect} from "react";
import axios from "axios";
import Header from "../../components/user/header";
import Swal from "sweetalert2";
import { CardLoading } from "../../utils/cardLoading";
import { NotFound } from "../user/notFound";

export const ProductDetails = ({selectedProduct}) => {

  const [userRole, setRole] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("loginFormData");
    if (user) {
      const parsedUser = JSON.parse(user);
      setRole(parsedUser.role)
    }
  }, []);

    const { productId } = useParams();
    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState([])
    const [cart, setCart] = useState({});


    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };

    useEffect(() => {
        // Make an API request to fetch the product details based on the productId
        axios.get(`http://localhost:8080/shop/product/${productId}`, { headers })
          .then((response) => {
            // Set the product data in the state
            setProduct(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [productId]);

      useEffect(() => {
        // Make an API request to fetch the product details based on the productId
        axios.get(`http://localhost:8080/shop/reviews/${productId}`, { headers })
          .then((response) => {
            console.log(response.data)
            setReviews(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [productId]);



      const handleAddCart = () => {
        axios.put(
          `http://localhost:8080/shop/product/${productId}/addToCart/${sessionUser.email}`,
          {},
          { headers }
        )
          .then((response) => {
            Swal.fire({
              title: `Added to cart`,
              icon: 'success',
              confirmButtonText: "Ok",
              preConfirm: () => {
                  window.location.href="/dashboard";
              },
          });
          })
          .catch((error) => {
            Swal.fire('Insufficient stock', 'Sorry! you are too late', 'error')
            console.error(error);
          });
      };
      

    return(
        <>
        <Header activePage={""} />
        {userRole === "BUYER" && (
         
          <div>
            <div className="body">
            {product ? (
                <div className="col-12 d-flex justify-content-center p-2">
                    <div className="col-5 px-5">
                        <img src={`data:image/jpeg;base64,${product.productImage}`} alt="" className="col-12 mx-auto rounded-5" />
                        

                    
                    </div>
                    <div className=" col-5 ">
                      <div className=" px-5 col-12">
                      <p className="display-4">{product.productName}</p>
                      <p className="display-6 text-muted mt-3">${product.price}</p>
                        <p className="lead mt-3">Stock: {product.stock}</p>
                      <Button onClick={handleAddCart}  variant="" className="btnOren col-12 mt-1">Add to cart <Icon.CartPlusFill className="mb-1"/></Button>

                        <hr />
                        <p className="lead">Description: </p>
                    <div className=" overflowContent px-4">
                       
                        <div className="">
                        <p className="">{product.productDescription}</p>
                        </div>
                        <p className="lead">Type: {product.productType}</p>
                        <p className="lead"></p>
                        <p className="lead"><Icon.GeoAltFill className="mb-1"/> <span className="fw-bold">{product.supplier.companyName}</span>, {product.supplier.city}, {product.supplier.state}, {product.supplier.country}.</p>
                    </div>
                      </div>

                    </div>

                </div>
            ) : (
            <>
            <div className="body d-flex justify-content-center">
            <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
            </div>
            </>

             )}


             <div className="body">
            <p className="display-6 mb-5">What people say about this product</p>
              <div className="d-flex justify-content-center">
              <div className=" overflowContent px-3 col-7">
              {reviews.length ? (
                <>
                {reviews.map((review)=>(
                  <>
                  <div key={review.productReviewId}>
                    <div className="loginBox mb-3">
                      <div className="d-flex justify-content-center col-12">
                        <div className="col-4">
                          <img src={`data:image/jpeg;base64,${review.reviewImage}`} alt="" className="col-12 rounded-5" />
                        </div>
                        <div className="col-8 my-auto px-5">
                          <p className="lead">"{review.comment}"</p>
                          <p className="lead">Rated <span className="text-warning"><Icon.StarFill className="mb-1"/> </span>{review.rating.toFixed(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                ))}
                </>
              ):(
                <div className="body ">
                <p className="lead text-center">
                  No reviews yet
                </p>
                </div>
              )}
              </div>
              <div className="col-5 loginBox my-auto mt-0 ms-5">
                <div className="">
                {product && (
                  <>
                  <p className="display-6">Rating</p>
                  <p className="display-1"><span className="text-warning"><Icon.StarFill className="mb-4 me-4" /></span>{product.rating.toFixed(1)}</p>
                  </>
                
                )}
                <hr />

                {reviews.length > 0 && (
                  <>
                  <p className="lead">{reviews.length} Reviews</p>
                  </>
                )}
                </div>
              </div>
              </div>
             
             </div>

            </div>
          </div>
        )}

        {userRole !== "BUYER" && (
                <NotFound />
            )}
        </>
 
    )
}