import { BuyerEditProfile } from "../../components/buyer/buyerEditProfile"
import React, { useEffect, useState } from "react";
import Header from "../../components/user/header"
import { NotFound } from "../user/notFound";

export const BuyerEditProfilePage = () => {

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
        {userRole === "BUYER" && (

        <div className="body">
            <BuyerEditProfile />
        </div>
        )}

        {userRole !== "BUYER" && (
                <NotFound />
            )}
        </>
    )
}