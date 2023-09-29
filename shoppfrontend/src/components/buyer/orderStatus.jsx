import axios from "axios"
import React, {useState, useEffect} from "react"
import Swal from "sweetalert2"
import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons"
import { CardLoading } from "../../utils/cardLoading";

export const OrderStatus = () => {
    const [orderStatus, setOrderStatus] = useState([])
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/shop/delivered-orders/${sessionUser.email}`, { headers })
          .then((response) => {
            console.log(response.data)
            const sortedOrders = response.data.sort((a, b) => new Date(b.purchaseOrder?.orderDate) - new Date(a.purchaseOrder?.orderDate));
            setOrderStatus(sortedOrders);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

      const handleCancelOrder = (orderStatusId) => {
        axios
          .put(`http://localhost:8080/shop/request-cancel/order/${orderStatusId}`, {}, { headers })
          .then((response) => {
            console.log(response.data);
            Swal.fire({
                icon: "success",
                title: "Request to cancel order sent.",
                text:"Please wait for seller to accept your request, if there is no response in 24 hours, it will be canceled automatically",
                footer: "",
                confirmButtonColor: "#127d3f",
                confirmButtonText: "Ok",
              });
            const updatedOrderStatus = orderStatus.map((order) =>
              order.orderStatusId === orderStatusId
                ? { ...order, requestedToCancel: true }
                : order
            );
            setOrderStatus(updatedOrderStatus);
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
    
      const handleFinish = (orderStatusId) => {
        axios
          .put(`http://localhost:8080/shop/confirm-arrived/${orderStatusId}`, {}, { headers })
          .then((response) => {
            console.log(response.data);
            const updatedOrderStatus = orderStatus.map((order) =>
              order.orderStatusId === orderStatusId
                ? { ...order, arrived: true }
                : order
            );
            setOrderStatus(updatedOrderStatus);
    
            Swal.fire({
              icon: "success",
              title: "Confirmed!",
              text: "Thank you for shopping with us.",
              footer: `<a href="">Leave a review</a>`,
              confirmButtonColor: "#127d3f",
              confirmButtonText: "Ok",
            });
          })
          .catch((error) => {
            // Handle error
            console.error(error);
          });
      };
      


    return(
        <div>

{orderStatus.length? (
            <>
 <div className="d-flex justify-content-center col-12">
          <div className="col-5 ">
          <p className="display-6 teksoren">Delivered</p>
          <div className="overflowContent2 px-3">
          {orderStatus.map((order) => (
                  order.canceled === false && order.arrived === false && (
                <div key={order.orderStatusId}>
                    <div className="loginBox bg-light mb-4">
                        <div className="col-12">
                            <div className="col-2 my-auto">
                                <p className="lead">
                                    order#{order.purchaseOrder.orderId}
                                </p>
                            </div>

                            <div className="col-12 d-flex justify-content-center mx-auto">
                            <div className="col-12 my-auto mx-auto  ">
                              <div className="overflowOrder px-2">
                              {order.purchaseOrder.orderItems.map((items) => (
                                
                                <div key={items.orderItemsId} className=" col-12 d-flex loginBox mb-3">
                                    <div className="col-4">
                                        <img src={`data:image/jpeg;base64,${items.product.productImage}`} alt="" className="col-12 rounded-5" />
                                    </div>
                                    <p className="col-8 ms-3 my-auto">x{items.quantity} {items.product.productName}</p>

                                </div>
                               ))}
                              </div>
                               

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
                                        <small>$ {order.purchaseOrder.totalCost.toFixed(2)}</small>
                                        <br />
                                        <small>{order.purchaseOrder.paymentMethod}</small>
                                    </div>
                                </div>

                            </div>
                                </div>



                                <div className="col-12 ">
                                <Button  onClick={() => handleFinish(order.orderStatusId)} variant="" className="btnPrimary col-12 my-2">Finish</Button>
                                <Button
                                onClick={() => handleCancelOrder(order.orderStatusId)}
                                variant=""
                                className="btn-danger col-12"
                                >
                                Cancel
                                </Button>
                                </div>

 
                        </div>
                    </div>
                </div>
                  )
                ))}
          </div>


            </div>

            <div className="col-5 ms-5">
          <p className="display-6 text-success">Arrived</p>
          <div className="overflowContent2 px-3">
          {orderStatus.map((order) => (
                  order.canceled === false && order.arrived === true && (
                <div key={order.orderStatusId}>
                    <div className="loginBox bg-light mb-4">
                        <div className="col-12">
                            <div className="col-2 my-auto">
                                <p className="lead">
                                    order#{order.purchaseOrder.orderId}
                                </p>
                            </div>

                            <div className="col-12 d-flex justify-content-center mx-auto">
                            <div className="col-12 my-auto mx-auto  ">
                              <div className="overflowOrder px-2">
                              {order.purchaseOrder.orderItems.map((items) => (
                                
                                <div key={items.orderItemsId} className=" col-12 d-flex loginBox mb-3">
                                    <div className="col-4">
                                        <img src={`data:image/jpeg;base64,${items.product.productImage}`} alt="" className="col-12 rounded-5" />
                                    </div>
                                    <div className="col-8 px-4 my-auto">
                                    <p className="">x{items.quantity} {items.product.productName}</p>

                                    <div className="col-12 ">
                                      <Button href={`/review/${items.product.productId}`}
                                      variant="" className="btnOren col-12 ">Review</Button>
                                      
                                      </div>
                                    </div>

                                </div>
                               ))}
                              </div>
                               

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
                                        <small>$ {order.purchaseOrder.totalCost.toFixed(2)}</small>
                                        <br />
                                        <small>{order.purchaseOrder.paymentMethod}</small>
                                    </div>
                                </div>

                            </div>
                                </div>



                                

 
                        </div>
                    </div>
                </div>
                  )
                ))}
          </div>


            </div>
          </div>
 
            </>
          ):(
            <>
            <div className="loginBox mt-5">
              <div className="body">
                <div className="p-5">
                  <p className="lead text-center">You haven't ordered anything yet</p>
                  <div className="d-flex justify-content-center">
                    <Button href="/myCart" variant="" className="btnOren" >Order something here <Icon.PlusLg className="mb-1"/></Button>
                  </div>
                </div>
              </div>
            </div>
            </>
          )}

          


         
         
        </div>
    )
}