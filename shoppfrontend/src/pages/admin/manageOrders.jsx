import { useEffect, useState } from "react";
import { AllOrdersAdmin } from "../../components/admin/allOrder"
import Header from "../../components/user/header"
import { NotFound } from "../user/notFound";

export const ManageOrders = () => {
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
        <div className="d-flex justify-content-center">
        <AllOrdersAdmin />

        </div>
        )}
        {userRole !== "ADMIN" && (
          <NotFound />
        )}</>
    )
}