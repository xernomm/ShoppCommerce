import axios from "axios";
import { AllProducts} from "../../components/supplier/allProductsFood";
import Header from "../../components/user/header";
import React, { useState, useEffect } from "react";
import { SupplierProfile } from "../../components/supplier/supplierProfile";
import { MyProductsList } from "../../components/supplier/myProductsList";
import { MyProductsPage } from "./myProductsPage";
import { AdminDashboardComp } from "../../components/admin/adminDashboard";

export function AllProductsPage(){
    const [userInfo, setUserInfo] = useState(null); 
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };
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

    return(
        <>
        {userInfo && userInfo.role === "SUPPLIER" && (
        <>
        <Header activePage={"/myProducts"} />
        <SupplierProfile />
        </>
        )}

      {userInfo && userInfo.role === "ADMIN" && (
        <>
        <Header activePage={"/dashboard"} />
        <AdminDashboardComp />
        </>
        )}
        
      {userInfo && userInfo.role === "BUYER" && (
        <>
        <Header activePage={"dashboard"} />

        <div className="bg-light">
                <div className="body pt-5">
                    <div className="col-12 d-flex justify-content-center pt-5">

                        <div className="col-12 ">
                        <AllProducts />

                        </div>
                        
                    </div>

                </div>
                </div>
        </>
        )}


        </>
    )
}