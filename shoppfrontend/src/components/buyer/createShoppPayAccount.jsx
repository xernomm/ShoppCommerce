import axios from "axios"
import React, {useState, useEffect} from "react"
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"
import Header from "../user/header";
import { NotFound } from "../../pages/user/notFound";

export const CreateShoppPay = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };
    
    const [shoppPayData, setShoppPayData] = useState({
         password: '',
    })
    
    const handleSubmit = (e) => {
        e.preventDefault()
        axios
        .post(`http://localhost:8080/shop/create-shoppPay?email=${sessionUser.email}`, shoppPayData, { headers })
        .then((response) => {
          console.log(response.data);
          setShoppPayData(response.data);
          Swal.fire({
            icon: "success",
            title: "Account Created!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
            preConfirm: () => {
                window.location.href = "/profile";
            },
          });
        })
        .catch((error) => {
            if (error.response.data.message === 'Password cannot be null.') {
                Swal.fire({
                  icon: 'error',
                  title: 'Insert PIN',
                  text: 'Please create a 4-Digit PIN',
                });
              }
              if (error.response.data.message === 'Password should contain only digits.') {
                Swal.fire({
                  icon: 'error',
                  title: 'PIN cannot contain alphabets',
                  text: 'Please create a 4-Digit PIN',
                });
              }
              if (error.response.data.message === 'Password should be exactly 4 digits.') {
                Swal.fire({
                  icon: 'error',
                  title: 'Create a 4-Digit PIN',
                  text: 'Please create a 4-Digit PIN',
                });
              }
          console.error(error.response);
        });

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShoppPayData((prevData) => ({ ...prevData, [name]: value }));
      };

    return(
        <>
        <Header activePage={""} />
        {sessionUser.role === "BUYER" && (
          <div className="body d-flex justify-content-center">
                <div className="loginBox">
                <div className="col-12 mb-4">
                        <p className="display-6">Hello <span className="teksoren">{sessionUser.userDetails.name}!</span></p>
                        <p className="lead">Create a <span className="teksoren fw-bold">ShoppPay</span> account for <span className="teksoren">FREE DELIVERY CHARGES</span> in your orders.</p>
                    </div>

                    <div className="col-12">
                    <Form className="col-12" onSubmit={handleSubmit}>
                                    <Form.Floating className="mb-3">
                                        <Form.Control
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Create your PIN"
                                        value={shoppPayData.password}
                                        onChange={handleChange}
                                        />
                                        <label htmlFor="password">Create your PIN</label>
                                    </Form.Floating>

                                    <Button variant='primary' className='btnOren col-6 mt-3' type="submit">Create Account</Button>
                            </Form>
                    </div>

                    
                </div>
            </div>
        )}
            
        {sessionUser.role !== "BUYER" && (
         <NotFound />
        )}  
        </>
    )
}