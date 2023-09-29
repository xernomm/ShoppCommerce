import { EditProductForm } from "../../components/supplier/editProductForm";
import Header from "../../components/user/header"

export const EditProductPage = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));

    return(
        <>
        <Header activePage={""} />
        <div className="body">
            <p className="display-6">Something new, <span className="teksoren">{sessionUser.userDetails.name}?</span></p>
            <div className="loginBox p-5">
                <EditProductForm />
            </div>
        </div>
        </>
    )
}