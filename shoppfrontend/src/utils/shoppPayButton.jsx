import axios from "axios"
import React, {useState, useEffect} from "react"
import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons"
import { useParams } from 'react-router-dom';
import Swal from "sweetalert2";

export const ShoppPayButton = ({ selectedOrder }) => {

    const { orderId } = useParams();

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [carts, setCarts] = useState(null); 
    const [orderMail, setOrderMail] = useState(null);

    useEffect(() => {
      axios
        .get(`http://localhost:8080/shop/get-order-mail/${orderId}`, {
          headers,
        })
        .then((response) => {
          console.log(response.data);
          setOrderMail(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

    
    const [buyer, setBuyer] = useState(null);

    useEffect(() => {
      if(orderMail !== null){
        axios
        .get(`http://localhost:8080/shop/get-buyer/${orderMail}`, {
          headers,
        })
        .then((response) => {
          console.log(response.data);
          setBuyer(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }, [orderMail]);
  
    useEffect(() => {
      if (buyer !== null) {
        axios
          .get(`http://localhost:8080/shop/cart/${buyer.cart.cartId}`, {
            headers,
          })
          .then((response) => {
            console.log("CART INFO:" + response.data);
            setCarts(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, [buyer]);
  
    const handleClearItems = () => {
      if (buyer !== null) {
      axios
        .delete(`http://localhost:8080/shop/clear-items/${buyer.cart.cartId}`, {
          headers,
        })
        .then((response) => {
          console.log("DELETED INFO:" + response.data);
          setCarts([]); // Set carts to an empty array when cleared
         
        })
        .catch((error) => {
          console.error(error);
        });
    };
  }

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

      const [order, setOrder] = useState({
        orderItems: [],
      });

      useEffect(() => {
        axios
          .get(`http://localhost:8080/shop/order-details/${orderId}`, { headers })
          .then((response) => {
            console.log('Response data:', response.data);
            setOrder({ ...response.data, orderItems: response.data.orderItems || [] });
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);
      


      const handleUpdateStock = async () => {
        try {
          if (!order || !order.orderItems) {
            console.error('Order or orderItems are undefined');
            return;
          }
      
          for (const orderItem of order.orderItems) {
            const productId = orderItem.product.productId;
            const quantity = orderItem.quantity;
      
            const productDetails = await axios.get(`http://localhost:8080/shop/product/${productId}`, { headers });
            const currentStock = productDetails.data.stock;
      
            const newStock = currentStock - quantity;
      
            await axios.put(`http://localhost:8080/shop/order/${orderId}/updateStock/${productId}`, { newStock }, { headers }).then(
               handleClearItems()
            );
          }
      
          console.log('Stock updated successfully');
        } catch (error) {
          console.error(error);
        }
      };

      const [paymentData, setPaymentData] = useState({
        password: '',
      });

      const handlePayShoppPay = (e) => {
        e.preventDefault()
        axios
        .post(`http://localhost:8080/shop/by-shoppPay/${sessionUser.email}/pay/${orderId}`, paymentData, { headers })
        .then((response) => {
          handleNewStatus()
          console.log(response.data);
          setOrder(response.data);
          Swal.fire({
            icon: "success",
            title: "Payment success!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
            preConfirm: async () => {
                await handleUpdateStock()
                window.close();
            },
          });
        })
        .catch((error) => {
            if (error.response.data.message === 'Invalid password.') {
                Swal.fire({
                  icon: 'error',
                  title: 'Incorrect PIN',
                  text: 'Please enter your correct PIN',
                });
              }
          console.error(error.response);
        });
      }

      const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prevData) => ({ ...prevData, [name]: value }));
      };

      const[orderStatus, setOrderStatus] = useState([])

      const handleNewStatus = () => {
        axios.put(`http://localhost:8080/shop/buyer/${sessionUser.email}/completed-order/${orderId}`,{}, { headers })
        .then((response)=>{
          console.log(response.data)
          setOrderStatus(response.data)
        }).catch((error) => {
          console.error(error);
        });
      }
      

    return(
        
        <>
        <div className="body">
            <div className="loginBox">
                <div className="col-12 d-flex">
                    <div className="col-4">
                    <p className="display-6 teksoren fw-bold">ShoppPay.</p>
                <Form className="col-12" onSubmit={handlePayShoppPay}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your PIN"
                            value={paymentData.password}
                            onChange={handlePaymentChange}
                            />
                            <label htmlFor="password">Enter your PIN</label>
                        </Form.Floating>

                        <Button variant='primary' className='btnOren col-6 mt-3' type="submit">Pay</Button>
                </Form>
                    </div>
                    

                <div className="col-8 px-5 my-auto">
                    <p className="lead">Order details</p>
                    <hr />
                    <div className="col-12 d-flex">
                    <div className="col-6">
                    <p>Normal cost: </p>
                    <p>Delivery cost: </p>
                    <p>Order maker: </p>
                </div>
                <div className="col-6">
                <p >${order.totalCost}</p>
                <p className="text-danger"><span className="strikethrough-text">${order.totalDelivery}</span> <span className="text-success">$0</span></p>
                <p> {sessionUser.userDetails.name}</p>
                </div>
                    </div>

                    <hr />

                    <div className="d-flex col-12">
                <div className="col-6">
                    <p className="">Total cost: </p>
                </div>
                <div className="col-6">
                {order.discount? (
                  <>
                
                <p className="fw-bold">${order.totalCost}</p>
                  </>
                ):(
                  <>
                <p className="fw-bold">${order.totalPrice}</p>
                  </>
                )}
                </div>
            </div>
                </div>
                </div>

            </div>
        </div>
       
        </>

    )
}