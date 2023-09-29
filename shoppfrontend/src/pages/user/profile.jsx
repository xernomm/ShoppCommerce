import { Button } from "react-bootstrap";
import { BuyerProfile } from "../../components/buyer/buyerProfile";
import Header from "../../components/user/header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SupplierProfile } from "../../components/supplier/supplierProfile";


export function Profile(){
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userInfo, setUserInfo] = useState(null); 

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

    return(
        <>
        <Header activePage={""} />
        
        {userInfo && (
        <div>
            {userInfo.role === "BUYER" && (
            <BuyerProfile />
            )}
            {userInfo.role === "SUPPLIER" && (
            <SupplierProfile />
            )}
        </div>
        )}

        </>
    )
}