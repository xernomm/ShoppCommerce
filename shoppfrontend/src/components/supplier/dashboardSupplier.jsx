import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import profileImg from '../../img/profile.jpg'
import order from '../../img/orders.jpg'
import goods from '../../img/cart.jpg'
import coupons from '../../img/coupons.jpg'
import * as Icon from "react-bootstrap-icons"
import store from '../../img/oneshop.jpg'
import Swal from "sweetalert2";

export const DashboardSupplierComp = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    const [userInfo, setUserInfo] = useState(null); 
    const [supplier, setSupplier] = useState(null); 
    const [supplierPay, setSupplierPay] = useState(null)
    const[showAlert, setShowAlert] = useState(false)
    const [suspended, setSuspended] = useState(false)
  
    const [topUpReq, setTopUpReq] = useState([])
    const [myProducts, setMyProducts] = useState([])
  
    useEffect(() => {
      axios.get(`http://localhost:8080/shop/user-info/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data)
          setUserInfo(response.data);
          setSuspended(response.data.active === false)
  
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
    useEffect(() => {
      axios.get(`http://localhost:8080/shop/get-supplier/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data)
          setSupplier(response.data);
          setShowAlert(!response.data.companyName)
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
  
  
    useEffect(() => {
      axios.get(`http://localhost:8080/shop/supplier-pay/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data)
          setSupplierPay(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
    useEffect(() => {
      axios.get(`http://localhost:8080/shop/all-products/supplier/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data)
          setMyProducts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
  const handleDeleteProduct = (productId) => {
    axios.delete(`http://localhost:8080/shop/delete-product/${productId}`, { headers })
          .then(response => {
  
              Swal.fire({
                  icon: 'success',
                  title: 'Deleted',
                  text: 'Product deleted successfully',
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
                  text: 'Failed to delete product',
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
  
  useEffect(() => {
    if ( showAlert && supplier ) {
        Swal.fire({
            title: `Hello ${supplier.name}!`,
            html: `Thank you for registering as a supplier in our community. Set your company details by clicking the <span class="fw-bold">Edit profile</span> button.`,
            icon: 'info'
        });
    }
  
    if ( suspended && userInfo ) {
      Swal.fire({
          title: `Account Suspended`,
          icon: 'info',
          confirmButtonText: "Ok",
          preConfirm: () => {
            sessionStorage.clear();
            window.localStorage.clear();
              window.location.href="/";
          },
      });
  }
  
  }, [showAlert, supplier, userInfo]);
    return(
        <>
        
        </>
    )
}