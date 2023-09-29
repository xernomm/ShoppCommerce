import { UploadProductForm } from "../../components/supplier/uploadProductForm"
import Header from "../../components/user/header"
import { NotFound } from "../user/notFound";

export const UploadProductPage = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));

    return(
        <>
        <Header activePage={""} />
        {sessionUser.role === "SUPPLIER" && (

        <div className="body">
            <p className="display-6">Something new, <span className="teksoren">{sessionUser.userDetails.name}?</span></p>
            <div className="loginBox">
             <UploadProductForm />
            </div>
        </div>
        )}

        {sessionUser.role !== "SUPPLIER" && (
         <NotFound />
        )}  
        </>
    )
}