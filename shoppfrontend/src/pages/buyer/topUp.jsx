import { TopUpForm } from "../../components/buyer/topUpForm"
import Header from "../../components/user/header"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NotFound } from "../user/notFound";


export const TopUp = () => {
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
  
    useEffect(() => {
      axios.get(`http://localhost:8080/shop/user-info/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data)
          setUserInfo(response.data);
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


    return(
        <>
        <Header activePage={""} />
        {userInfo && userInfo.role === "BUYER" && (

        <div className="body">
            <div className="d-flex justify-content-center col-12">
                <div className="col-8 loginBox bg-light">
                <p className="display-6">Top up</p>

                <p className="lead">Filling-up your <span className="teksoren">ShoppPay,</span> {userInfo.userDetails?.name || "Name not available"}?</p>
                
                {shoppPay && (
                <p className="lead mb-3">Current balance: <span className="fw-bold">${shoppPay.balance.toFixed(2)}</span></p>

                )}
                <hr />
                <TopUpForm />
                </div>

                

               

            </div>
        </div>
        )}
        {userInfo && userInfo.role !== "BUYER" && (
                <NotFound />

                )}
        </>
    )
}