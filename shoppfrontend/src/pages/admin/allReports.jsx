import Header from "../../components/user/header"
import { BuyerEditProfile } from "../../components/buyer/buyerEditProfile"
import React, { useEffect, useState } from "react";
import { NotFound } from "../user/notFound";
import AllMessageAdmin from "../../components/admin/allContactUsMessage";

export const AllReports = () => {
    const [userRole, setRole] = useState(null);
  
    useEffect(() => {
      const user = sessionStorage.getItem("loginFormData");
      if (user) {
        const parsedUser = JSON.parse(user);
        setRole(parsedUser.role)
      }
    }, []);

    return(
        <>
        <Header activePage={""} />

        {userRole === "ADMIN" && (
            <AllMessageAdmin />
        )}

        {userRole !== "ADMIN" && (
            <NotFound />
        )}

        </>
    )
}