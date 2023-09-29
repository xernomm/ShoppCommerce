import React, {useState, useEffect} from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import Swal from 'sweetalert2';

const PayPalButton = ({ orderId }) => {

  const [order, setOrder] = useState({
    orderItems: [],
  });
    const[orderStatus, setOrderStatus] = useState([])
    
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
      axios
        .get(`http://localhost:8080/shop/order-details/${orderId}`, { headers })
        .then((response) => {
          console.log('Response data:', response.data);
          setOrder({ ...response.data, orderItems: response.data.orderItems || [] });
          setCarts(response.data.buyer.cart.cartId)
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
    
      

      const createOrder = (data, actions) => {
        return axios.get(`http://localhost:8080/shop/order-details/${orderId}`, { headers })
          .then((response) => {
            const orderData = response.data;
            console.log('Order data:', orderData);
      
            if (!orderData) {
              console.error('Order gada goblog');
              return null; 
            }
      
            console.log('Order totalCost:', orderData.totalCost);
      
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: orderData.totalCost.toFixed(2),
                  },
                },
              ],
            });
          })
          .catch((error) => {
            console.error(error);
          });
      };
      
      
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
      
            await axios.put(`http://localhost:8080/shop/order/${orderId}/updateStock/${productId}`, { newStock }, { headers });
          }
      
          console.log('Stock updated successfully');
        } catch (error) {
          console.error(error);
        }
      };

      const [orders, setOrders] = useState(null);
     
      const [vouchers, setVouchers] = useState([])
      const [appliedVoucher, setAppliedVoucher] = useState(null);
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
    }
      


      
      const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {

          Swal.fire({
            icon: "success",
            title: "Payment success!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
            preConfirm:  () => {
                handleUpdateStock()
                handleIsPaid()
                handleClearItems();
                window.location.href="/myCart";
            },
          });

          console.log('Payment successful:', details);
        });
      };

      const handleIsPaid = () => {
        axios.put(`http://localhost:8080/shop/order-paid/${orderId}`,{}, { headers })
        .then((response)=>{
          handleNewStatus()
          console.log(response.data)
          setOrder(response.data)
        }).catch((error) => {
          console.error(error);
        });
      }

      const handleNewStatus = () => {
        axios.put(`http://localhost:8080/shop/buyer/${sessionUser.email}/completed-order/${orderId}`,{}, { headers })
        .then((response)=>{
          console.log(response.data)
          setOrderStatus(response.data)
        }).catch((error) => {
          console.error(error);
        });
      }
      
     

      
      
      

      
  return (
    <PayPalScriptProvider options={{ 'client-id': 'AZTVB3TKz4NVAbz95p2mHmp1God-ayJxrRqJq3py7XWUs80o4Zn3RRUlUL9ufTqF0CMf2PAU4-rTUaXJ' }}>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
