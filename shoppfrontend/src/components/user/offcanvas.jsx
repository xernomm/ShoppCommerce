import axios from 'axios';
import profileImg from '../../img/profile.jpg'
import * as Icon from "react-bootstrap-icons"
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import LogoutButton from "./logoutButton";

export const OffCanvas = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(null);
  const [shoppPay, setIsLoadingShoppPay] = useState(null);
  const [supplier, setIsLoadingSupplier] = useState(null);
  const [buyer, setIsLoadingBuyer] = useState(null);
  const [supplierPay, setIsLoadingSupplierPay] = useState(null);
  const [carts, setIsLoadingCarts] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [show, setShow] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [orderHistory, setOrderHistory] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log("Fetching user info for email:", sessionUser.email);
    axios
      .get(`http://localhost:8080/shop/user-info/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log("User info response:", response.data);
        setShowAlert(response.data.active === false);
        setIsLoadingUserInfo(false);
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, []);
  
  

  useEffect(() => {
    // if (buyer!==null) {
        axios
        .get(`http://localhost:8080/shop/shoppPay-account/${sessionUser.email}`, { headers })
        .then((response) => {
          setIsLoadingShoppPay(response.data);
          // Process the response data
        })
        .catch((error) => {
          console.error("Error fetching shoppPay:", error);
        });
      
    // }
  }, []);
  
  useEffect(() => {
    axios
      .get(`http://localhost:8080/shop/get-supplier/${sessionUser.email}`, { headers })
      .then((response) => {
        setIsLoadingSupplier(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  useEffect(() => {
    // if (userInfo !== null ) {
      axios
        .get(`http://localhost:8080/shop/supplier-pay/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data);
          setIsLoadingSupplierPay(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    // }
  }, []);
  
  useEffect(() => {
    axios
      .get(`http://localhost:8080/shop/get-buyer/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data);
        setIsLoadingBuyer(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  useEffect(() => {
      axios
        .get(`http://localhost:8080/shop/cart/email/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data);
          setIsLoadingCarts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
  }, []);
  

    const handleShowOffCanvas = () => {
        console.log("Opening OffCanvas");
        const user = sessionStorage.getItem('loginFormData');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserEmail(parsedUser.email);
          setUserName(parsedUser.name);
      
          axios
            .get(`http://localhost:8080/shop/user-info/${parsedUser.email}`, {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
              },
            })
            .then((userInfoResponse) => {
              console.log(userInfoResponse.data);
              setUserInfo(userInfoResponse.data);
              setShow(true);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      };

      
      const handleClose = () => setShow(false);
      const toggleShow = () => setShow((s) => !s);
    
      

    return(
        <>
 
        <>
        <Button onClick={toggleShow} variant="link" className="col-1 me-5">
        <Icon.Justify className="text-white display-6" />
      </Button>

        {userInfo && userInfo.role !== "ADMIN" &&(
  <Offcanvas show={show} onHide={handleClose} variant="bg-light" className="offcanvas-menu bg-oren" scroll={true} backsdrop={false}>
  <Offcanvas.Header closeButton>
    <Offcanvas.Title className="text-white">
      <div className="d-flex">
        <Icon.Person className="my-auto me-2" />
        <LogoutButton />
      </div>
    </Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body>
    <div className="overCanvas px-3">
      <div className="loginBox bg-white">
        <div className="d-flex">
          <div className="col-4 my-auto d-flex justify-content-center">
            {userInfo && (
              <div>
                {userInfo.profilePicture && (
                  <img
                    src={`data:image/jpeg;base64,${userInfo.profilePicture}`}
                    alt=""
                    className="col-7 profileDash2"
                  />
                )}

                {!userInfo.profilePicture && (
                  <img src={profileImg} alt="" className="col-7 profileDash2 " />
                )}
              </div>
            )}
          </div>
          <div className="col-8 my-auto d-flex p-3">
            {userInfo && (
              <div>
                <p className="lead">{userInfo.userDetails.name}</p>
                <Button href="/profile" variant="" className="btnOren col-12">
                  My profile <Icon.PersonFill className="mb-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {userInfo && buyer &&  (
        <>
          <div className="loginBox p-3 bg-white my-auto mt-4">
            <p className=" teksoren fw-bold">
              ShoppPay. <Icon.CashCoin />
            </p>
            {shoppPay && (
              <>
                <div>
                  <p className="display-6 fw-bold">${shoppPay.balance.toFixed(2)} <Button href="/topUp" variant="" className="btnOren">
                    Top up
                  </Button></p>
                  
                </div>
              </>
            )}

            {!shoppPay && (
              <>
                <div className="">
                  <p className="lead mb-4">
                    You haven't created a <span className="teksoren">ShoppPay</span> account.
                  </p>
                  <Button href="/createShoppPay" variant="" className="btnOren col-6">
                    Create my ShoppPay
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="loginBox bg-white mt-4 p-3">
            <p className="lead teksoren">
              My cart <Icon.Cart />
              <Button href="/myCart" className="ms-3 btnOren" variant="">
                Checkout
              </Button>
            </p>
            <div>
            {carts.map((cartItem) => (
              <div key={cartItem.cartItemId}>
                <div className="col-12 d-flex loginBox mb-3">
                  <div className="col-4 my-auto">
                    <img
                      src={`data:image/jpeg;base64,${cartItem.product.productImage}`}
                      alt=""
                      className="col-10 mx-auto rounded-5"
                    />
                  </div>
                  <div className="col-6 my-auto d-flex">
                    <p className=" fw-bold my-auto">{cartItem.product.productName}</p>
                    <p className=" mx-4 my-auto">x{cartItem.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          </div>
        </>
      )}

      {userInfo && supplier &&(
        <>
          <div className="loginBox p-3 bg-white my-auto mt-4">
            <p className="lead teksprimary fw-bold">
              ShoppIncome. <Icon.CashCoin />
            </p>
            {supplierPay && supplier &&(
              <>
                <div>
                  <p className="display-6 fw-bold">${supplierPay.balance.toFixed(2)}</p>
                  <Button href="#" variant="" className="btnBiru">
                    Withdraw <Icon.CashStack className="mb-1" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  </Offcanvas.Body>
</Offcanvas>
)}
    </>
      
        </>


    )

}