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

export const SupplierProfile = () => {

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
        <div className="body">

            <div className="col-12 d-flex justify-content-center">
                <div className="col-4">
                <div className="col-12">
                            {userInfo && (
                            <>

                                <div className="profileBox1">
                                <div className="col-12 my-auto d-flex justify-content-center">
                                <div>
                                {userInfo.profilePicture && (
                                <img src={`data:image/jpeg;base64,${userInfo.profilePicture}`} alt="" className="col-12 profileDash" />
                                )}

                                {!userInfo.profilePicture && (
                                <img src={store} alt="" className="col-12 profileDash " />
                                )}
                                </div>
                            </div>
                                </div>
                                    <div style={{borderRadius:"0px 0px 20px 20px"}} className="col-12 loginBox bg-white text-center">
                                            <br />
                                            <br />
                                            <br />
                                            {supplier && (
                                            <>
                                            
                                            <p className="display-6 teksoren">{supplier.companyName || "-"}</p>
                                            <p className="lead teksprimary"><Icon.Calendar3 className="mb-1 ms-1" /> Joined on <span className="teksoren">{userInfo.joinedDate}</span></p>
                                            <hr />
                                            <>
                                            <p className="lead teksprimary"><Icon.Map className="mb-1 ms-1" /> {supplier.city || ""}, {supplier.state || ""}, {supplier.country || ""}. <br /> {supplier.postcode || ""}  </p>
                                            <p className="lead teksprimary"><Icon.Person className="mb-1 ms-1"/> {userInfo.userDetails?.name || "-"}</p>
                                            </>

                                            </>


                                            )}
                                            <div className="d-flex justify-content-end mt-5">
                                            <Button href="/editProfileSupplier" variant="" className="btnBiru">Edit <Icon.PencilFill className="mb-1 ms-1" /></Button>
                                            </div>
                                    </div>
                            </>
                            )}
                            </div>
                </div>

                <div className="col-7 px-5">
                    <div className="loginBox col-12">
                      <p className="display-6 teksprimary fw-bold">
                        ShoppIncome. <Icon.CashCoin />
                      </p>
                      <hr />
                      {supplierPay && (
                        <>
                        <div>
                          <p className="lead mb-3">Balance </p>
                          <p className="display-5 fw-bold">${supplierPay.balance.toFixed(2)} </p>
                          <Button href="#" variant="" className="btnBiru mt-2">Withdraw <Icon.CashStack className="mb-1"/></Button>
                          
                        </div>
                        </>
                      )}

                      
                    </div>

                    <div className="loginBox mt-4">
                        <p className="display-6 mb-4">
                            Add Products <span><Button style={{borderRadius:"50%"}} variant="" href="/newProduct" className="btnBiru btnPls"><Icon.Plus className=" plusBtn"/></Button></span>
                        </p>
                    
                        <div className="overflowContent px-3">
                            {myProducts.map((products) => (
                                <>
                                <div key={products.productId} className="loginBox bg-light mb-4">
                                    <div className="d-flex">
                                        <div className="col-6 px-2 my-auto">
                                            <img src={`data:image/jpeg;base64,${products.productImage}`} alt="" className="col-12 rounded-5" />
                                        </div>

                                        <div className="col-6 p-3">
                                            <p className="display-6">
                                                {products.productName}
                                            </p>
                                            <p className="lead">${products.price}</p>
                                            <p>Stock available: {products.stock}</p>

                                            <div className="d-flex justify-content-center">
                                            <Button href={`/editProduct/${products.productId}`} variant="" className="col-6 me-1 btnBiru">Edit</Button>
                                            <Button onClick={() => handleDeleteProduct(products.productId)} variant="" className="col-6 btn-danger">Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                            ))}
                        </div>
                    </div>

                   

  
                </div>
            </div>

        </div>
    )
}