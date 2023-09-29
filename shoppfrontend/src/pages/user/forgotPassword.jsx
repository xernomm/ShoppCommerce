import { ChangePasswordForm } from "../../components/user/changePasswordForm";
import Header from "../../components/user/header";

export function ForgotPasswordPage(){
    return(
            <>
            <Header activePage={""} />
            <div className="backImg">
                        <div style={{padding:"10%"}} className="body">
                            <div className="d-flex justify-content-center">
                                <div className="col-7 loginBox body">
                                    <ChangePasswordForm />
                                </div>
                            </div>
                        </div>
                    </div>
            </>
    )
}