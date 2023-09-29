import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"


export const ChangePasswordForm = () => {
    const questions = [
        {key:"email", question:"Please enter your email", type:"email"},
        {key:"password", question:"Create your new password", type:"password"},
        {key:"confirmPassword", question:"Confirm your new password", type:"password"},
    ]
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [formData, setFormData] = useState({});

    const handleNext = () => {
     
        const currentKey = questions[currentQuestion].key;
        const currentValue = formData[currentKey];
    
        // Check if the field is empty
        if (!currentValue) {
          Swal.fire("Oops.. Sorry!", "Please fill in the field.", "warning");
          return;
        }
    
        if (currentKey === "confirmPassword") {
          const passwordValue = formData["password"];
      
          // Check if the passwords match
          if (currentValue !== passwordValue) {
            Swal.fire("Passwords Do Not Match", "Please confirm your password correctly.", "error");
            return;
          }
        }
    
        setFormData({
          ...formData,
          [currentKey]: currentValue,
        });

        const checkMail = {
          email: formData.email
        }

         axios.post(
            "http://localhost:8080/shop/check-email",
            checkMail
          ).then((response) => {
          console.log(response.data)
          console.log("Email found:", checkMail);

          })
        .catch ((error) => {
          console.error("Email not found:", error);
          console.log(error.response.data.message);
          if (error.response.data.message === 'Email not found.') {
            Swal.fire({
              icon: 'error',
              title: 'Enter a valid email',
              text:
                "We couldn't find your email. Please register if your email is not registered.",
              footer: '<a href="/getStarted">Register</a>',
              preConfirm: () => {
                return new Promise((resolve) => {
                  window.location.href = "/forgotPassword";
                  resolve();
                });
              },
            });
            return;
          }
        })
    
        setCurrentQuestion(currentQuestion + 1);
      };

      const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };


      const handleSubmit = async (e) => {
        e.preventDefault()

        const changePasswordData = {
          email: formData.email,
          password: formData.password
        };
        try {
          const response = await axios.post(
            "http://localhost:8080/shop/change-password",
            changePasswordData
          );
          console.log(response.data)
          await new Promise((resolve) => setTimeout(resolve, 300));
          console.log("Password changed succesfully", changePasswordData);
          Swal.fire('Password changed succesfully', '', 'success').then(() => {
            window.location.href = '/login';
          });
        } catch (error) {
          console.error("Failed to change password:", error);
          if (error.response.data.message === 'Email not found.') {
            Swal.fire({
              icon: 'error',
              title: 'Enter a valid email',
              text:
                "We couldn't find your email. Please register if your email is not registered.",
              footer: '<a href="/getStarted">Register</a>',
            });
          }
          Swal.fire("Error!", "Failed to change password.", "error").then(() => {
            window.location.href = '/login';
          });
        }
      }   
    
    return(
        <div>
          <h1 className="display-6 teksprimary fw-bold mb-3">Forgot your <span className="teksoren">Password</span> ?</h1>
          <hr />
          {questions.map((q, index) => (
            <div key={q.key} style={{ display: index === currentQuestion ? "block" : "none" }}>
              <div className="mb-3">
              <p className="teksprimary mb-4">To reset your password, we need to ask a few questions ({currentQuestion + 1}/3)</p>
              <Form.Floating>
              <Form.Control
                type={q.type || "text"}
                id={q.key}
                name={q.key}
                placeholder={q.question}
                value={formData[q.key] || ""}
                onChange={handleFormChange}
              />
              <label htmlFor={q.key}>{q.question}</label>
              </Form.Floating>

              </div>
              <div className="d-flex justify-content-end mt-4">
                <Button variant="" className="btnBiru col-4" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
            
          ))}
           {currentQuestion === questions.length && (
        <div className="d-flex justify-content-center mt-4">
          <div className="col-12">
            <p className="lead mb-3">Almost done! make sure you remember your password</p>
            <Button variant="" className="btnBiru col-12" onClick={handleSubmit}>
              Reset My Password <Icon.Unlock className="mb-2"/>
            </Button>
          </div>
        </div>
      )}

        </div>
    )
}