import { Button } from "react-bootstrap";
import shop1 from '../../img/shopphalf.jpg'
import shop2 from '../../img/shopphalf2.jpg'
import flash from '../../img/flash.jpg'
import * as Icon from "react-bootstrap-icons"
export function LandingComponent(){
    return(
        <div className="backImg">
        <div style={{padding:"10%"}}>
            <div className="col-12 d-flex justify-content-center ">
                
            {/* style={{backdropFilter:"blur(8px)"}} */}

                <div className="col-8  loginBox ">
                    <div  className="col-12 my-auto">
                    <h1 style={{fontFamily:"fantasy", fontSize:"160px"}}  className="text-center mb-3 fw-bold teksoren text-glow">SHOPP.</h1>
                    <p className="display-6 text-center teks-dark text-glow"><span className="teksoren fw-bold"> #1</span> E-commerce in <span className="text-dark">Asia.</span></p>
                    <p className="lead mb-5 text-dark text-center text-glow">Find anything, <span className="teksoren fw-bold">Shopp</span> anything.</p>
                    <div className="d-flex justify-content-center">
                    <Button href="/getStarted" variant="" className="btnOren col-6 mx-1">Get Started</Button>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                    <Button href="/login" variant="" className="btnBiru col-6 mx-1">Login</Button>
                    </div> 
                    
                    </div>
                    
                </div>
             
            </div>
            
        </div>
        </div>

    )
}