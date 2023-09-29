import { AllUsers } from "../../components/admin/allUsers"
import Header from "../../components/user/header"
import { NotFound } from "../user/notFound";
import { useEffect, useState } from "react";


export const ManageUsers = () => {
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
        <AllUsers />
        )}
        {userRole !== "ADMIN" && (
            <NotFound />
        )}
        </>
    )
}