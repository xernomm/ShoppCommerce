import { OrderStatus } from "../../components/buyer/orderStatus"
import Header from "../../components/user/header"
import React, { useEffect, useState } from "react";
import { NotFound } from "../user/notFound";

export const OrderStatusPage = () => {
    const user = sessionStorage.getItem("loginFormData");
    const parsedUser = JSON.parse(user);
  
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setRole] = useState(null);
  
    useEffect(() => {
      const user = sessionStorage.getItem("loginFormData");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.email);
        setRole(parsedUser.role)
      }
    }, []);

    
    return(
        <>
        <Header activePage={""} />
        <div>
            {userEmail && userRole === "BUYER" && (
                <div className="body">
                <div className="d-flex col-12 justify-content-center">
                    <div className="col-12">
                        <div>
                            <OrderStatus />
                        </div>
                    </div>
                </div>
                </div>
            )}

            { userRole !== "BUYER" && (
                <NotFound />
            )}
           
        </div>
        </>
    )
}