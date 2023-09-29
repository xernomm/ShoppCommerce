import { useEffect, useState } from "react";
import { AdminSendVoucher } from "../../components/admin/adminSendVouchers"
import Header from "../../components/user/header"
import { NotFound } from "../user/notFound";

export const SendVoucher = () => {
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
    <AdminSendVoucher />
    )}
    {userRole !== "ADMIN" && (
     <NotFound />
    )} 
    </>
)
}