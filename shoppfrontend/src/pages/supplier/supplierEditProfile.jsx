import { useEffect, useState } from "react";
import { SupplierEditProfile } from "../../components/supplier/supplierEditProfile"
import Header from "../../components/user/header"
import { NotFound } from "../user/notFound";


export const SupplierEditProfilePage = () => {
    
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
        {userRole === "SUPPLIER" && (
            <div className="body">
                    <SupplierEditProfile />
            </div>
       )}

        {userRole !== "SUPPLIER" && (
                <NotFound />
            )}

        </>
    )
}