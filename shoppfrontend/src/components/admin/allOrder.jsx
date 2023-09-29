import axios from "axios"
import React, {useState, useEffect} from "react"
import { Button, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons"
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

export const AllOrdersAdmin = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [orders, setOrders] = useState([]);

      useEffect(() => {
        axios.get("http://localhost:8080/shop/all-order-status", { headers })
          .then((response) => {
            const sortedOrders = response.data.sort((a, b) => new Date(b.purchaseOrder?.orderDate) - new Date(a.purchaseOrder?.orderDate));
            setOrders(sortedOrders);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

      const handleCancelOrder = (orderStatusId, orderMail) => {
            axios
            .put(`http://localhost:8080/shop/force-cancel/${orderStatusId}/order/${orderMail}`, {}, { headers })
            .then((response) => {
              console.log(response.data);
              Swal.fire({
                  icon: "success",
                  title: "Order canceled",
                  confirmButtonColor: "#127d3f",
                          confirmButtonText: "Ok",
                          preConfirm: () => {
                            return new Promise((resolve) => {
                              window.location.reload();
                              resolve()
                            });
                          },
                });
              const updatedOrderStatus = orders.map((order) =>
                order.orderStatusId === orderStatusId
                  ? { ...order, requestedToCancel: true }
                  : order
              );
              setOrders(updatedOrderStatus);
            })
            .catch((error) => {
              if (error.response.data.message === 'Already requested to cancel.') {
                Swal.fire({
                  icon: 'success',
                  title: 'Already requested',
                  text: 'You have already requested this order to be canceled. If there is no response in 24 hours, it will be canceled automatically',
                });
              }
              if (error.response.data.message === 'Already arrived.') {
                Swal.fire({
                  icon: 'error',
                  title: 'Already arrived!',
                  text: 'You cannot cancel an arrived order!',
                });
              }
              if (error.response.data.message === 'Already canceled.') {
                Swal.fire({
                  icon: 'success',
                  title: 'Already canceled!',
                  text: 'Your order is already canceled!',
                });
              }
              console.error(error);
            });
        
      };
    
      const handleFinish = ( orderStatusId ) => {
        axios.put(`http://localhost:8080/shop/confirm-arrived/${orderStatusId}`, {}, { headers })
          .then((response) => {
            console.log(response.data);
            Swal.fire({
                icon: "success",
                title: "Confirmed!",
                confirmButtonColor: "#127d3f",
                          confirmButtonText: "Ok",
                          preConfirm: () => {
                            return new Promise((resolve) => {
                              window.location.reload();
                              resolve()
                            });
                          },
              });
            const updatedOrderStatus = orders.map((order) =>
              order.orderStatusId === orderStatusId
                ? { ...order, requestedToCancel: true }
                : order
            );
            setOrders(updatedOrderStatus);
          })
          .catch((error) => {
            if (error.response.data.message === 'Order already marked as arrived.') {
                Swal.fire({
                  icon: 'success',
                  title: 'Already confirmed!',
                });
              }
            console.error(error);
          });
      }


      const handleDeclineCancel = (orderStatusId) => {
        axios
          .put(`http://localhost:8080/shop/decline-cancel/order/${orderStatusId}`, {}, { headers })
          .then((response) => {
            console.log(response.data);
            const updatedOrderStatus = orders.map((order) =>
              order.orderStatusId === orderStatusId
                ? { ...order, requestedToCancel: false } // Mark the cancel request as declined
                : order
            );
            setOrders(updatedOrderStatus);
    
            Swal.fire({
              icon: "success",
              title: "Request declined!",
              confirmButtonColor: "#127d3f",
              confirmButtonText: "Ok",
            });
          })
          .catch((error) => {
            if (error.response.data.message === 'Order already marked as arrived.') {
              Swal.fire({
                icon: 'success',
                title: 'Already confirmed!',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Something went wrong.',
              });
            }
            console.error(error);
          });
      };
    return(
        <div className="body col-11">

          <div className="loginBox mb-5 bg-white">
          <p className="display-6 mb-5">All Orders</p>
            <div className="overflowContent2 px-5">
                {orders.map((order) => (
order.canceled === false && (
  <>
  <div key={order.orderStatusId}>
  <div className="loginBox bg-light mb-4">
      <div className="d-flex col-12">
          <div className="col-2 my-auto">
              <p className="lead">
                  Order ID: <br /> order#{order.purchaseOrder.orderId}
              </p>
          </div>

          <div className="col-7 d-flex justify-content-center mx-auto">
          <div className="col-10 my-auto mx-auto overflowContent p-4">
             {order.purchaseOrder.orderItems.map((items) => (
              
              <div key={items.orderItemsId} className=" col-12 d-flex loginBox mb-3">
                  <div className="col-4">
                      <img src={`data:image/jpeg;base64,${items.product.productImage}`} alt="" className="col-12 rounded-5" />
                  </div>
                  <p className="col-8 ms-3 my-auto">x{items.quantity} {items.product.productName}</p>

              </div>
             ))}
          </div>
              </div>

          <div className="col-3 my-auto loginBox p-3">

          <div className="d-flex col-12">
                  <div className="col-6">
                      <small>Date: </small>
                  </div>
                  <div className="col-6">
                      <small>{order.purchaseOrder.orderDate}</small>
                  </div>
              </div>

              <div className="d-flex col-12">
                  <div className="col-6">
                      <small>Total cost: </small>
                      <br />
                      <small>Payment: </small>
                  </div>
                  <div className="col-6">
                      <small> ${order.purchaseOrder.totalCost.toFixed(2)}</small>
                      <br />
                      <small>{order.purchaseOrder.paymentMethod}</small>
                  </div>
              </div>

              <div className="col-12 ">
              <Button  onClick={() => handleFinish(order.orderStatusId)} variant="" className="btnPrimary col-12 my-2">Finish</Button>
              <Button
                onClick={() => handleCancelOrder(order.orderStatusId, order.purchaseOrder.orderMail)}
                variant=""
                className="btn-danger col-12"
              >
                Cancel
              </Button>

              </div>
          </div>


      </div>
  </div>
</div>
  </>
)


                ))}
            </div>
          </div>



          <div className="loginBox mb-5 bg-white">
          <p className="display-6 mb-5">Cancel order requests</p>
            <div className="overflowContent2 px-5">
                {orders.map((order) => (
                    order.requestedToCancel === true && order.canceled === false && (
                    <>
                    <div key={order.orderStatusId}>
                    <div className="loginBox bg-light mb-4">
                        <div className="d-flex col-12">
                            <div className="col-2 my-auto">
                                <p className="lead">
                                    Order ID: <br /> order#{order.purchaseOrder.orderId}
                                </p>
                            </div>

                            <div className="col-7 d-flex justify-content-center mx-auto">
                            <div className="col-10 my-auto mx-auto overflowContent p-4">
                               {order.purchaseOrder.orderItems.map((items) => (
                                
                                <div key={items.orderItemsId} className=" col-12 d-flex loginBox mb-3">
                                    <div className="col-4">
                                        <img src={`data:image/jpeg;base64,${items.product.productImage}`} alt="" className="col-12 rounded-5" />
                                    </div>
                                    <p className="col-8 ms-3 my-auto">x{items.quantity} {items.product.productName}</p>

                                </div>
                               ))}
                            </div>
                                </div>

                            <div className="col-3 my-auto loginBox p-3">

                            <div className="d-flex col-12">
                                    <div className="col-6">
                                        <small>Date: </small>
                                    </div>
                                    <div className="col-6">
                                        <small>{order.purchaseOrder.orderDate}</small>
                                    </div>
                                </div>

                                <div className="d-flex col-12">
                                    <div className="col-6">
                                        <small>Total cost: </small>
                                        <br />
                                        <small>Payment: </small>
                                    </div>
                                    <div className="col-6">
                                        <small>$ {order.purchaseOrder.totalCost}</small>
                                        <br />
                                        <small>{order.purchaseOrder.paymentMethod}</small>
                                    </div>
                                </div>

                                <div className="col-12 mt-5">
                                <Button  onClick={() => handleDeclineCancel(order.orderStatusId)} variant="" className="btn-danger col-12 my-2">Decline</Button>

                                <Button
                                onClick={() => handleCancelOrder(order.orderStatusId, order.purchaseOrder.orderMail)}
                                variant=""
                                className="btnBiru col-12"
                              >
                                Approve
                              </Button>

                                </div>
                            </div>

 
                        </div>
                    </div>
                </div>
                    </>
                    )
                ))}
            </div>
          </div>
            
        </div>
    )
}