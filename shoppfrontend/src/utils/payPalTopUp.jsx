import React, {useState, useEffect} from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import Swal from 'sweetalert2';

export const PayPalforTopUp = ({ topUpId }) => {

    const [topUpReq, setTopUpReq] = useState([])

    const[orderStatus, setOrderStatus] = useState([])
    
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
      axios
        .get(`http://localhost:8080/shop/top-up-requests/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log('Response data:', response.data);
          setTopUpReq(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
    
      

      const createOrder = (data, actions) => {
        return axios.get(`http://localhost:8080/shop/top-up-request-details/${topUpId}`, { headers })
          .then((response) => {
            const orderData = response.data;
            console.log('Order data:', orderData);
      
            if (!orderData) {
              console.error('Order gada goblog');
              return null; 
            }
      
            console.log('Order totalCost:', orderData.balance);
      
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: orderData.balance.toFixed(2),
                  },
                },
              ],
            });
          })
          .catch((error) => {
            console.error(error);
          });
      };
      
     
      


      
      const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {

          Swal.fire({
            icon: "success",
            title: "Payment success!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
            preConfirm:  () => {
            handleIsPaid()
            window.location.href = "/profile";
            },
          });

          console.log('Payment successful:', details);
        });
      };

      const handleIsPaid = () => {
        axios.put(`http://localhost:8080/shop/top-up/${topUpId}/payment/${sessionUser.email}`,{}, { headers })
        .then((response)=>{
          console.log(response.data)
          setTopUpReq(response.data)
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

