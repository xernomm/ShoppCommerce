import { useEffect, useState } from "react";
import { EditProductFormAdmin } from "../../components/admin/adminEditProduct";
import { EditProductForm } from "../../components/supplier/editProductForm";
import Header from "../../components/user/header"
import { NotFound } from "../user/notFound";

export const EditProductAdminPage = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
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
        <div className="body">
         <p className="display-6">Something new, <span className="teksoren">{sessionUser.userDetails.name}?</span></p>
             <div className="loginBox p-5">
                <EditProductFormAdmin />
                </div>
        </div>
        )}

        {userRole !== "ADMIN" && (
            <NotFound />
        )}
       
        </>
    )
}