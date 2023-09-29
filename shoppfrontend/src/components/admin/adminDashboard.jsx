import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons"
import profileImg from '../../img/profile.jpg'
import order from '../../img/orders.jpg'
import users from '../../img/users.jpg'
import products from '../../img/goods.jpg'
import vouchers from '../../img/coupons.jpg'
import info from '../../img/info.jpg'
import axios from "axios";
import { ShoppProfit } from "./shoppProfit";


export const AdminDashboardComp = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userInfo, setUserInfo] = useState(null); 
  useEffect(() => {
    axios.get(`http://localhost:8080/shop/user-info/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setUserInfo(response.data);

      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

    return(
        <>

        {userInfo && userInfo.userDetails && (
        <div className="body col-12 d-flex justify-content-center bg-light">
        <div className="col-3 me-3">
                <div className="loginBox text-center bg-white">
                    <div className='d-flex justify-content-center mb-4'>
                    {userInfo.profilePicture && (
                    <img src={`data:image/jpeg;base64,${userInfo.profilePicture}`} alt="" className="col-12 profileDash2" />
                    )}

                    {!userInfo.profilePicture && (
                    <img src={profileImg} alt="" className="col-12  " />
                    )}
                    </div>
                <h1 className="lead teksprimary text-center fw-bold mb-4">{userInfo.userDetails?.name || "Name not available"}</h1>
                <p className="lead mb-1">Hi <span className="teksprimary">{userInfo.userDetails?.name || "Name not available"}</span>! <br /> you are signed-<span className="teksprimary">In</span> as,</p>
                <p className="lead fw-bold teksprimary mb-4">{sessionUser.email}<span className="lead">.</span></p>
                <div className='py-5'>
                </div>
                </div>


                
        </div>

        <div className="col-7 ms-3">
          <ShoppProfit />
            
            <div className="loginBox col-12">
            <h1 className="display-6 mb-4">
                Welcome,<span className="fw-bold teksprimary"> Admin</span> 
            </h1>
            <hr />
            <div className="overflowContent pt-5">
                <div className="d-flex col-12 mb-5">

                <a className='linkprimary col-5 mx-auto' href="/manageUsers">
                <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                        <img src={users} alt="" className="col-12 rounded-5" />
                                    </div>
                                <p className="lead text-center">Manage users</p>    
                </a>

                <a className='linkprimary col-5 mx-auto' href="/manageProducts">
                <div className="adminBox rounded-5 col-12 py-5 bg-white">
                                        <img src={products} alt="" className="col-12 rounded-5 my-auto" />
                                    </div>
                                <p className="lead text-center">Manage products</p>    
                </a>


                </div>
                <div className="d-flex col-12 mb-5">

                    <a className='linkprimary col-5 mx-auto' href="/manageOrders">
                    <div className="adminBox rounded-5 col-12 my-auto bg-white">
                                            <img src={order} alt="" className="col-12 rounded-5" />
                                        </div>
                                    <p className="lead text-center">Manage orders</p>    
                    </a>

                    <a className='linkprimary col-5 mx-auto' href="/sendVouchers">
                    <div className="adminBox rounded-5 py-5 col-12 my-auto bg-white">
                                            <img src={vouchers} alt="" className="col-12 rounded-5" />
                                        </div>
                                    <p className="lead text-center">Send vouchers</p>    
                    </a>

                    </div>

                    <div className="d-flex col-6 mb-5">
                    <a className='linkprimary col-10 mx-auto' href="/allReports">
                    <div className="adminBox rounded-5 py-5 col-12 my-auto bg-white">
                                            <img src={info} alt="" className="col-12 rounded-5" />
                                        </div>
                                    <p className="lead text-center">Reports</p>    
                    </a>

                    </div>


                </div>
            
            </div>
 

            
        </div>




        </div>
        )}

        </>
    )
}