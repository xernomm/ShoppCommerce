import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from "axios"
import Swal from "sweetalert2";

export const LoginForm = () => {
    const [loginName, setLoginName] = useState('');
  const [loginPassword, setPasswordLogin] = useState('');

  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });

const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/auth/login', loginFormData)
      .then((response) => {
        console.log(response.data)
      sessionStorage.setItem("loginFormData", JSON.stringify(response.data));
        Swal.fire({
          icon: "success",
          title: "Login success!",
          footer: "",
          confirmButtonColor: "#127d3f",
          confirmButtonText: "Go to homepage",
          preConfirm: () => {
            return new Promise((resolve) => {
              window.location.href = "/dashboard";
              resolve();
            });
          },
        });
        console.log(response.data);
      })
      .catch((error) => {
          if (error.response.data.message === 'Invalid password.') {
              Swal.fire({
                icon: 'error',
                title: 'Oops... Sorry',
                text: 'Incorrect password. Check your credentials',
                footer: '<a href="/forgotPassword">Forgot password?</a>',
              });
            }
            if (error.response.data.message === 'Email not found.') {
              Swal.fire({
                icon: 'error',
                title: 'Oops... Sorry',
                text:
                  "We couldn't find your email. Please register if your email is not registered.",
                footer: '<a href="/getStarted">Register</a>',
              });
            }
            if (error.response.data.message === 'User suspended.') {
              Swal.fire({
                icon: 'error',
                title: 'Account Suspended',
                text:
                  "Your account has been deactivated due to violations of our community guidelines. Repeated actions may result to permanent deletion of your account.",
                footer: '<a href="/contact-us">Report</a>',
              });
            }
      });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
  };

    return(
        <div>
            <Form onSubmit={handleLogin}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={loginFormData.email}
                            onChange={handleLoginChange}
                            />
                            <label htmlFor="email">Email</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={loginFormData.password}
                            onChange={handleLoginChange}
                            />
                            <label htmlFor="password">Password</label>
                        </Form.Floating>

                        <Button variant='primary' className='btnBiru col-6 mt-3' type="submit">Login</Button>
                    </Form>
                    <p className="lead mt-3">
                        <span>
                            <a className="teksprimary linkprimary" href='/forgotPassword'>
                            Forgot Password?
                            </a>
                        </span>
                    </p>
                    <p className="lead mt-3">
                        Don't have an account? Click{" "}
                        <span>
                            <a className="teksprimary linkprimary" href='/getStarted'>
                                here to Sign-Up
                            </a>
                        </span>
                    </p>
        </div>
    )
}