import { Button, Form, Modal } from "react-bootstrap"
import axios from "axios";
import React, {useState, useEffect} from "react";
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"
import { useParams } from "react-router-dom";
import Header from "../user/header";
import { NotFound } from "../../pages/user/notFound";


export const AdminVoucherForm = () => {
    const { userEmail } = useParams();
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };

    const [voucherData, setVoucherData] = useState({
        voucherName: '',
        quantity:'',
    })

  const [buyer, setBuyer] = useState(null); 
    const [vouchers, setVouchers] = useState([])
    const [shoppPay, setShoppPay] = useState(null)


  useEffect(() => {
    axios.get(`http://localhost:8080/shop/get-buyer/${userEmail}`, { headers })
      .then((response) => {
        console.log(response.data)
        setBuyer(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/shoppPay-account/${userEmail}`, { headers })
      .then((response) => {
        console.log(response.data)
        setShoppPay(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/shop/vouchers/buyer/${userEmail}`, { headers })
      .then((response) => {
        console.log('vouchers:', response.data);
        setVouchers(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
    .post(`http://localhost:8080/shop/add-voucher?email=${userEmail}`, voucherData, { headers })
    .then((response) => {
      console.log(response.data);
      setVoucherData(response.data);
      Swal.fire({
        icon: "success",
        title: "Voucher sent!",
        footer: "",
        confirmButtonColor: "#127d3f",
        confirmButtonText: "Ok",
        preConfirm: () => {
            window.location.href="/sendVouchers";
        },
      });
    })
    .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Something went wrong',
              text: 'Try again later.',
            });
          
      console.error(error.response);
    });
}

const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({ ...prevData, [name]: value }));
  };

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
        <div className="body">
            <div className="">
                <div className="d-flex justify-content-center">
                    <div className="col-7 loginBox">
                    <p className="lead">Voucher Details</p>
                     <Form className="col-12" onSubmit={handleSubmit}>
                               <Form.Floating className="mb-3">
                                    <Form.Select 
                                        id="voucherName"
                                        name="voucherName"
                                        placeholder="Voucher Type"
                                        value={voucherData.voucherName}
                                        onChange={handleFieldChange}
                                    >
                                    <option value="">Select voucher type</option>
                                    <option value="TWENTY">20% Discount</option>
                                    <option value="QUARTER">25% Discount</option>
                                    <option value="HALF">50% Discount</option>
                                    <option value="SEVENTYFIVE">75% Discount</option>
                                    <option value="FULL">99% Discount</option>
                                    </Form.Select>
                                    <label htmlFor="name">Voucher Type</label>
                                </Form.Floating>

                                <Form.Floating className="mb-3">
                                    <Form.Control 
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        placeholder="Quantity"
                                        value={voucherData.quantity}
                                        onChange={handleFieldChange}
                                    />
                                    <label htmlFor="age">Quantity</label>
                                </Form.Floating>

                                <Button type="submit" variant="" className="btn-success  mt-4 col-6">
                                    Send
                                </Button>


                             </Form>
                    </div>
                    <div className="col-5 px-4">
                        {buyer && (
                            <>
                            <div className="loginBox">
                               <p className="lead">
                                Send to
                               </p>
                               <p className="display-6">
                                {buyer.name}
                               </p>

                               {shoppPay && buyer &&(
                                <>
                                <p className="lead">
                                    {buyer.name}'s current <span className="teksoren">ShoppPay</span> balance:
                                    <br />
                                    <span className="fw-bold display-6">
                                        $ {shoppPay.balance.toFixed(2)}
                                    </span>
                                </p>
                                </>
                               )}
                            </div>
                            {vouchers.length ? (
        <>
        <div className="loginBox px-4 mt-3">
          <p className="lead">{buyer.name}'s Available vouchers</p>
        <div className="overflowContent px-4">
          {vouchers.map((voucher)=> (
            voucher.quantity !== 0 && (
<>
            <div key={voucher.voucherId}>
             <div className="d-flex">
             <div className="col-9 voucherBox rounded-5 mb-3">
               <div className="body py-1 rounded-5">
                  <div className="col-6 my-auto">
                    <p className="display-6 fw-bold text-white text-glow">
                      {voucher.voucherName}
                    </p>
                  </div>
                  <div className="col-6 my-auto px-5">
                    
                  </div>
                 
               </div>
              </div>
              <div className="col-3 px-3 my-auto">
              <p className="lead text-center">
                      x{voucher.quantity}
                    </p>
              </div>
             
             </div>
            </div>
            </>
            )
            
          ))}
        </div>
        </div>
        
        </>
      ):(
        <>
        </>
      )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        )}
        {userRole !== "ADMIN" && (
          <NotFound />
        )}    
        </>
    )
}