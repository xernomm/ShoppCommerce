import axios from "axios"
import Swal from "sweetalert2"
import React, {useState, useEffect} from "react"
import { Button, Form } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons"

export const CartComponent = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [buyer, setBuyer] = useState(null); 
      const [carts, setCarts] = useState([])


      useEffect(() => {
          axios.get(`http://localhost:8080/shop/get-buyer/${sessionUser.email}`, { headers })
            .then((response) => {
              console.log(response.data)
              setBuyer(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }, []);



        useEffect(() => {
          if (buyer !== null) {
            axios
              .get(`http://localhost:8080/shop/cart/${buyer.cart.cartId}`, { headers })
              .then((response) => {
                console.log(response.data);
                setCarts(response.data);
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }, [buyer]);

    const handleCancelItem = (cartItemId) => {
        axios.delete(`http://localhost:8080/shop/cancel-item/${cartItemId}`, { headers })
        .then(response => {

            Swal.fire({
                icon: 'success',
                title: 'Item canceled',
                text: 'Order item canceled successfully',
                confirmButtonColor: "#127d3f",
                    confirmButtonText: "Ok",
                    preConfirm: () => {
                      return new Promise((resolve) => {
                        window.location.reload();
                        resolve()
                      });
                    },
              });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to cancel order item',
                confirmButtonColor: "#127d3f",
                    confirmButtonText: "Ok",
                    preConfirm: () => {
                      return new Promise((resolve) => {
                        window.location.reload();
                        resolve()
                      });
                    },
              });
            console.error(error);
        });
    }

    const [showEditForm, setShowEditForm] = useState(false);

    const [orderData, setOrderData] = useState({
      quantity: '',
    })

    const handleEditOrder = (cartItemId) => {

      const updatedCarts = carts.map((cartItem) => {
        if (cartItem.cartItemId === cartItemId) {
          return { ...cartItem, quantity: orderData.quantity };
        }
        return cartItem;
      });
      setCarts(updatedCarts);


      axios
        .post(
          `http://localhost:8080/shop/edit-order?cartId=${buyer.cart.cartId}&cartItemId=${cartItemId}`,
          { quantity: orderData.quantity },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
         
        })
        .catch((error) => {
          console.error(error);
          if (error.response.data.message === 'Insufficient stock.') {
            Swal.fire({
              icon: 'error',
              title: 'Oops... Sorry',
              text: 'Insufficient stock',
              preConfirm: () => {
                return new Promise((resolve) => {
                  window.location.reload();
                  resolve();
                });
              },
            });
          }
        });
    };
 


    return(
        <div>
            {carts.map((cartItem) => (
                <div key={cartItem.cartItemId}> 
                    <div className="col-12 d-flex loginBox mb-3">
                        <div className="col-4 my-auto">
                            <img src={`data:image/jpeg;base64,${cartItem.product.productImage}`} alt="" className="col-10 mx-auto rounded-5" />
                        </div>
                        <div className="col-6 my-auto">
                            <p className="lead fw-bold">{cartItem.product.productName}</p>
                            <p className="lead">${cartItem.product.price}</p>
                            <p className="lead">Quantity: {cartItem.quantity}</p>

                            {showEditForm ? (
                            <div>
                              <Form onSubmit={handleEditOrder} className="d-flex col-12 my-4">
                                <Form.Floating className="col-7 me-2">
                                  <Form.Control
                                    type="number"
                                    placeholder="Quantity"
                                    value={orderData.quantity}
                                    onChange={(e) =>
                                      setOrderData({ ...orderData, quantity: e.target.value })
                                    }
                                  />
                                  <label htmlFor="">Quantity</label>
                                </Form.Floating>
                                <Button
                                  variant=""
                                  className="btnBiru col-3"
                                  onClick={() => handleEditOrder(cartItem.cartItemId)}
                                >
                                  Save
                                </Button>
                              </Form>
                            </div>
                          ) : null}
                           
                            <p className="lead">{cartItem.product.supplier.city}, {cartItem.product.supplier.state}, {cartItem.product.supplier.country}.</p>

                        </div>
                        <div className="col-2 my-auto">
                            <Button variant="" className="btn-danger col-12" onClick={() => handleCancelItem(cartItem.cartItemId)}>Cancel</Button>
                            {!showEditForm && (
                              <Button
                                variant=""
                                className="btnBiru col-12 mt-2"
                                onClick={() => setShowEditForm(true)}
                              >
                                Edit
                              </Button>
                            )}
                            {showEditForm && (
                              <Button
                                variant=""
                                className="btnBiru col-12 mt-2"
                                onClick={() => setShowEditForm(false)}
                              >
                                Edit
                              </Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}