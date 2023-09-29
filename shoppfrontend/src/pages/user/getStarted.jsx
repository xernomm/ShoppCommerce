import Header from "../../components/user/header"
import { RegisForm } from "../../components/user/regisForm"
import shop from "../../img/oneshop.jpg"

export const GetStarted = () => {
    return(
            <>
            <Header activePage={"getStarted"} />
            <div className="backImg">
                <div className=" body">
                    

                    <div  className="col-12 loginBox my-auto mt-5 mb-5">
                        <h1 className="display-6 teksoren fw-bold">Let's <span className="teksprimary">Get started</span></h1>
                        <br />
                            <RegisForm />
                        </div>


                </div>
            </div>

            </>
    )
}
