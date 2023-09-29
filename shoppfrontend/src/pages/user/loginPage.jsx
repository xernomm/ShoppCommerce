import Header from "../../components/user/header";
import { LoginForm } from "../../components/user/loginForm";
import login from "../../img/login.jpg"

export function LoginPage(){
    return(
<>
<Header activePage={"getStarted"} />

<div className="backImg">
<div className="body" style={{padding:"10%"}}>
            <div className="col-12 d-flex justify-content-center">

                <div className="col-5 loginBox my-auto body">
                <p className="display-6 teksprimary fw-bold mb-4">
                        Login to <span className="teksoren">Shopp.</span>
                    </p>
                    <LoginForm />
                </div>
            </div>
        </div>
</div>

</>
    )
}