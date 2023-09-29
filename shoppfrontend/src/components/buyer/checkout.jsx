import axios from "axios"
import React, {useState, useEffect} from "react"
import { Button, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons"
import PayPalButton from "../../utils/payPalButton";
import Swal from "sweetalert2";
import { ShoppPayButton } from "../../utils/shoppPayButton";


export const CheckOutBtn = () => {
    
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

   
  
    const [orders, setOrders] = useState(null);
    const [order, setOrder] = useState({
      orderItems: [],
    });
    const [vouchers, setVouchers] = useState([])
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [carts, setCarts] = useState(null); 
    
    const [buyer, setBuyer] = useState(null);

    useEffect(() => {
      axios
        .get(`http://localhost:8080/shop/get-buyer/${sessionUser.email}`, {
          headers,
        })
        .then((response) => {
          console.log(response.data);
          setBuyer(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
    useEffect(() => {
      if (buyer !== null) {
        axios
          .get(`http://localhost:8080/shop/cart/${buyer.cart.cartId}`, {
            headers,
          })
          .then((response) => {
            console.log(response.data);
            setCarts(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, [buyer]);
  
    const handleClearItems = () => {
      axios
        .delete(`http://localhost:8080/shop/clear-items/${buyer.cart.cartId}`, {
          headers,
        })
        .then((response) => {
          console.log(response.data);
          setCarts([]); // Set carts to an empty array when cleared
          Swal.fire({
            icon: "success",
            title: "Cart is now empty!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
            preConfirm: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
    
    useEffect(() => {
      axios
        .get(`http://localhost:8080/shop/vouchers/buyer/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log('vouchers:', response.data);
          setVouchers(response.data)
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

    const handleGetDetails = () => {
      axios
        .put(`http://localhost:8080/shop/order/${sessionUser.email}`, {}, { headers })
        .then((response) => {
          console.log(response.data);
          setOrders(response.data);
    
          axios
            .get(`http://localhost:8080/shop/order-details/${response.data.orderId}`, { headers })
            .then((orderDetailsResponse) => {
              console.log('Order details:', orderDetailsResponse.data);
              setOrder({ ...response.data, orderItems: orderDetailsResponse.data.orderItems || [] });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error.response);
        });
    };
    
    const handleSetDiscount = (voucher) => {
      axios
        .put(
          `http://localhost:8080/shop/discount/${sessionUser.email}/order/${orders.orderId}/voucher/${voucher.voucherId}`,
          {},
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          setOrders(response.data);
          
          Swal.fire({
            icon: "success",
            title: "Voucher applied!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
           
          });
          setAppliedVoucher(voucher);
          console.log("APPLIED VOUCHER" + appliedVoucher)
  
          axios
            .get(
              `http://localhost:8080/shop/order-details/${response.data.orderId}`,
              { headers }
            )
            .then((orderDetailsResponse) => {
              console.log("Order details:", orderDetailsResponse.data);
              setOrder({
                ...response.data,
                orderItems: orderDetailsResponse.data.orderItems || [],
              });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
           
          });
          console.error(error.response.data);
        });
    };


 


    const openPopup = () => {
      const newWindow = window.open(`/shoppPay/${orders.orderId}`, "New Window", "width=1000,height=800");
      if (newWindow) {
        newWindow.myData = { message: "Hello from the parent window!" };
        newWindow.addEventListener("beforeunload", () => {
          // Child window is closing, so reload the parent window
          window.location.href="/myOrders";
        });
      }
      setShowModal(false);
    };
    



    
    

    
        const [showModal, setShowModal] = useState(false);

        const handleShowModal = () => {
        setShowModal(true);
        };

        const handleCloseModal = () => {
        setShowModal(false);
        };


        const handleClearOrders = () => {
        window.location.reload()
        }
  
    return (
      <div>
       {orders ? (
    <>
      {order && (
        <div className="body loginBox">
          <p className="lead">Order Checkout</p>

          <hr />

          <div className="d-flex col-12">
            <div className="col-6">
              <p className="text-muted">Order date: </p>
            </div>
            <div className="col-6">
              <p className="text-muted">{order.orderDate}</p>
            </div>
          </div>

          {/* Other order details rendering here */}
          
        
           {order.totalPrice && (
            <div className="d-flex col-12">
              <div className="col-6">
                <p className="">Total price: </p>
              </div>
              <div className="col-6">
                <p className="">${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          )}
            {order.serviceFee && (
            <div className="d-flex col-12">
              <div className="col-6">
                <p className="">Service fee: </p>
              </div>
              <div className="col-6">
                <p className="">${order.serviceFee.toFixed(2)}</p>
              </div>
            </div>
          )}
           {order.tax && (
            <div className="d-flex col-12">
              <div className="col-6">
                <p className="">Tax </p>
              </div>
              <div className="col-6">
                <p className="">${order.tax.toFixed(2)}</p>
              </div>
            </div>
          )}
           {order.totalDelivery && (
            <div className="d-flex col-12">
              <div className="col-6">
                <p className="">Delivery fee: </p>
              </div>
              <div className="col-6">
                <p className="">${order.totalDelivery.toFixed(2)}</p>
              </div>
            </div>
          )}
          <hr />
           {order.totalCost && (
            <div className="d-flex col-12">
              <div className="col-6">
                <p className="">Total cost: </p>
              </div>
              <div className="col-6">
                <p className="fw-bold">${order.totalCost.toFixed(2)}</p>
              </div>
            </div>
          )}
          {appliedVoucher && (
            <>
            <div className="loginBox py-2 offerSuccess">
              <p className=" my-auto text-success">Voucher applied!</p>
            </div>
            </>
          )}

            <Button onClick={handleShowModal} variant="" className="btnPrimary col-12 mb-2 mt-5">
              Pay now
            </Button>
          
          <Button onClick={handleClearOrders} variant="" className="btn-danger col-12 mb-2">
            Cancel Order
          </Button>
        </div>
      )}
    </>
      ) : (
        <div className="loginBox">
          <div style={{ paddingTop: "10%", paddingBottom: "30%" }} className="px-5">
            <p className="lead my-3">
              Click <span className="teksoren">Get Checkout</span> to view your order details.
            </p>
            <Button onClick={handleGetDetails} variant="" className="btnPrimary col-12 mt-3">
              Get Checkout
            </Button>
          </div>
        </div>
      )}


      {orders && (
        <>
        {vouchers.length ? (
        <>
        <div className="loginBox px-4 mt-5">
          <p className="lead">Check <span className="fw-bold teksoren">available promos</span> for you!</p>
        <div className="overflowContent px-4">
        {vouchers.map((voucher)=> (
            voucher.quantity !== 0 && (
<>
            <div key={voucher.voucherId}>
             <div className="d-flex">
             <div className="col-9 voucherBox rounded-3 mb-3">
               <div className="body py-1 rounded-3  d-flex">
                  <div className="col-6 my-auto">
                    <p className="lead fw-bold text-white text-glow">
                      {voucher.voucherName}
                    </p>
                  </div>
                  <div className="col-6 my-auto ">
                            <Button
                                    variant=""
                                    className="col-12 btnOren"
                                    onClick={() => handleSetDiscount(voucher)}
                                  >
                                    Apply
                                  </Button>
                  </div>
                 
               </div>
              </div>
              <div className="col-3 px-3 my-auto">
              <p className="lead text-center">
                      x{voucher.quantity}
                    </p>
              </div>
             
             </div>
            </div>
            </>
            )
            
          ))}
        </div>
        </div>

        </>
      ):(
        <>
        </>
      )}
        </>
      )}
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <p className="lead"> How would you like to pay?</p>
            </Modal.Header>
            <Modal.Body className="p-5">
                <p className="lead mb-4">Select payment method</p>
                {orders && (
                  <>
                <PayPalButton orderId={orders.orderId} />
                <Button onClick={openPopup} variant="" className="col-12 btnOren">ShoppPay <Icon.CashCoin /></Button>
                
                  </>

                )}
                <div className="d-flex col-12">
                    <div className="col-5">
                        <hr />
                    </div>
                    <div className="col-2">
                        <p className="lead text-center">or</p>
                    </div>
                    <dov className="col-5">
                        <hr />
                    </dov>
                </div>
                <Button variant="" className="btn-secondary col-12 mb-2">Cash on Delivery <Icon.CashStack className="mb-1" /> </Button>
                <Button variant="" className="btnBiru col-12 mb-2">Mobile banking <Icon.PhoneFill className="mb-1" /> </Button>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="outline-danger" className='' onClick={handleCloseModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
      </div>
    );
  };