import React, { useEffect, useState } from "react";
import axios from "axios";


export const ShoppProfit = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const [masterProfit, setMasterProfit] = useState(null);

  
    useEffect(() => {
        axios.get("http://localhost:8080/shop/calculate-master-profit", { headers })
          .then((response) => {
            console.log(response.data)
            setMasterProfit(response.data)
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);


    return(
        <>
            {masterProfit && (
                <div className="loginBox mb-4">
                    <p className="display-6 teksprimary fw-bold"><span className="teksoren ">Shopp</span> Profit</p>
                    <hr />
                    <p className="display-1 fw-bold">${masterProfit.toFixed(2)}</p>
                </div>
            )}
        </>
    )
}