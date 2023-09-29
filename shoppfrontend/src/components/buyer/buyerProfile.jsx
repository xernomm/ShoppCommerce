import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import profileImg from '../../img/profile.jpg'
import order from '../../img/orders.jpg'
import goods from '../../img/cart.jpg'
import coupons from '../../img/coupons.jpg'
import * as Icon from "react-bootstrap-icons"
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export const BuyerProfile = () => {
  const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userInfo, setUserInfo] = useState(null); 
  const [buyer, setBuyer] = useState(null); 
  const [shoppPay, setShoppPay] = useState(null)
  const [topUpReq, setTopUpReq] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/user-info/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setUserInfo(response.data);
        setShowAlert(response.data.active === false)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
    axios.get(`http://localhost:8080/shop/shoppPay-account/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setShoppPay(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/top-up-requests/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setTopUpReq(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/delivered-orders/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setOrderHistory(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = (orderStatsId) => {
    axios.delete(`http://localhost:8080/shop/delete-history/order/${orderStatsId}`, { headers })
      .then(response => {
        setOrderHistory(orderHistory.filter(orderHistory => orderHistory.orderStatusId !== orderStatsId));
      })
      .catch(error => {
        console.error(error.response);
        Swal.fire('Error', 'An error occurred while deleting the message', 'error');
      });
  };

  const handleDeleteTopUp = (topUpIdd) => {
    axios.delete(`http://localhost:8080/shop/delete-top-up/${topUpIdd}`, { headers })
      .then(response => {
        setTopUpReq(topUpReq.filter(topUpReq => topUpReq.topUpId !== topUpIdd));
      })
      .catch(error => {
        console.error(error.response);
        Swal.fire('Error', 'An error occurred while deleting the message', 'error');
      });
  };

  useEffect(() => {
    if ( showAlert && userInfo ) {
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
  }, [showAlert, userInfo]);

  return (
    <div>
        <div className="">
        <div className="body">
            <div className="d-flex justify-content-center col-12">
                <div className="col-4 ">
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
                    <img src={profileImg} alt="" className="col-12 profileDash " />
                    )}
                    </div>
                </div>
                     </div>
                        <div style={{borderRadius:"0px 0px 20px 20px"}} className="col-12 loginBox bg-white text-center">
                                <br />
                                <br />
                                <br />
                                <p className="display-6 teksoren">{userInfo.userDetails?.name || "Name not available"}</p>
                                <p className="lead teksprimary"><Icon.Calendar3 className="mb-1 ms-1" /> Joined on <span className="teksoren">{userInfo.joinedDate}</span></p>
                                <p className="lead teksprimary"><Icon.Person className="mb-1 ms-1" /> <span className="teksoren">{userInfo.userDetails?.name || "Name not available"}</span>, {userInfo.userDetails?.age || "Age not available"} years old</p>
                                <hr />
                                {buyer && (
                                <p className="lead teksprimary"><Icon.Map className="mb-1 ms-1" /> {buyer.city || ""}, {buyer.country || ""}. <br /> {buyer.postcode || ""}  </p>

                                )}
                                <div className="d-flex justify-content-end mt-5">
                                <Link to="/editProfileBuyer"><Button variant="" className="btnBiru">Edit<Icon.PencilFill className="mb-1 ms-1" /></Button></Link> 
                                </div>
                        </div>
                </>
                )}
                  </div>
                  
                  <div className="col-12">
                  <div className=" profileBox col-12 mt-3">
                        <Link to="/myOrders" className="linkprimary ">
                            <div className="hoverBox bg-white d-flex m-3">
                                <img src={order} alt="" className="col-4" />
                                <p className="lead my-auto text-center col-8 fw-bold">
                                    Order Status
                                </p>
                            </div>
                        </Link>

                        <Link to="/myCart" className="linkprimary ">
                            <div className="hoverBox bg-white d-flex m-3">
                                <img src={goods} alt="" className="col-4" />
                                <p className="lead my-auto text-center col-8 fw-bold">
                                   My Cart
                                </p>
                            </div>
                        </Link>

                        <a href="" className="linkprimary ">
                            <div className="hoverBox bg-white d-flex m-3">
                                <img src={coupons} alt="" className="col-4 py-4" />
                                <p className="lead my-auto text-center col-8 fw-bold">
                                    My Vouchers
                                </p>
                            </div>
                        </a>
                        </div>
                  </div>

                </div>  

                <div className="col-7 px-5">
                    <div className="loginBox col-12">
                      <p className="display-6 teksoren fw-bold">
                        ShoppPay. <Icon.CashCoin />
                      </p>
                      <hr />
                      {shoppPay && (
                        <>
                        <div>
                          <p className="lead mb-3">Balance </p>
                          <p className="display-5 fw-bold">${shoppPay.balance.toFixed(2)} 
                            </p>
                           <Link to="/topUp"><Button  variant="" className="btnOren  mb-1">Top up <Icon.PlusLg className=""/></Button></Link>


                        </div>
                        </>
                      )}

                      {!shoppPay && (
                        <>
                        <div className="">
                          <p className="lead mb-4">You haven't created a <span className="teksoren">ShoppPay</span> account.</p>
                          <Button href="/createShoppPay" variant="" className="btnOren col-6">Create my ShoppPay</Button>
                        </div>
                        </>
                      )}
                    </div>

                    {orderHistory.length > 0 && (
                                        <div className="loginBox mt-2">
                                        <p className="lead fw-bold">Order history</p>
                                        <div className="overflowContent p-4">
                                          {orderHistory.map((request)=>(
                                            request.canceled === false && request.arrived === true && (
                                            <div key={request.orderStatusId}>
                                              <div className="loginBox mb-2">
                                                <div className="col-12 d-flex">
                                                  <div className="col-3 my-auto">
                                                  <p className="lead fw-bold my-auto">Order #{request.orderStatusId}</p>
                                                  </div>
                                                  <div className="col-3 px-3 my-auto">
                                                    <p className=" fw-bold text-danger ">{request.purchaseOrder?.paymentMethod || ""} -${request.purchaseOrder?.totalCost.toFixed(2) || ""}</p>
                                                  </div>
                                                  <div className="col-3 px-3 my-auto">
                                                    <small className=" text-muted my-auto">{request.purchaseOrder?.orderDate || ""} </small>
                                                  </div>
                                                  <div className="col-3 my-auto d-flex justify-content-center">
                                                    <Button onClick={() => handleDelete(request.orderStatusId)} variant="" className="btn-danger col-10">Clear</Button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            )
                                            

                                            
                                          ))}
                                        </div>
                                      </div>
                  )}

                    {orderHistory.length === 0 && userInfo && (
                       <div className="loginBox mt-2">
                         <p className="lead fw-bold">Order history</p>
                         <div className="body">
                            <div className="d-flex justify-content-center">
                              <div>
                              <p className="lead">You haven't ordered anything here, <span className="teksoren">{userInfo.userDetails.name}.</span></p>
                              <div className="d-flex justify-content-center">
                              <Button href="/allProducts" variant="" className="btnPrimary col-6">Add something to cart <Icon.PlusLg className="mb-1"/></Button>
                              </div>

                              </div>
                              </div>
                            </div>
                         </div>
                  )}


                    {shoppPay && topUpReq.length > 0 && (
                        <>
                        <div className="loginBox mt-2">
                          <p className="lead fw-bold">Top up history</p>
                          <div className="overflowContent p-4">
                            {topUpReq.map((request)=>(
                              request.paid === true && (
                              <div key={request.topUpId}>
                                <div className="loginBox mb-2">
                                  <div className="col-12 d-flex">
                                    <div className="col-3 my-auto">
                                    <p className="lead fw-bold my-auto">Top up</p>
                                    </div>
                                    <div className="col-3 my-auto">
                                      <p className=" fw-bold text-success my-auto">balance +${request.balance}</p>
                                    </div>
                                    <div className="col-3 my-auto">
                                      <p className=" text-muted my-auto">{request.date} </p>
                                    </div>
                                    <div className="col-3 my-auto d-flex justify-content-center">
                                      <Button onClick={() => handleDeleteTopUp(request.topUpId)} variant="" className="btn-danger col-10">Clear</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              )
                              
                            ))}
                          </div>
                        </div>
                        </>
                      )}


                </div>
            </div>




      </div>
        </div>

    </div>
  );
};
