import { Button, Form } from "react-bootstrap"
import * as Icon from "react-bootstrap-icons"
import React, { useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";


function ContactUsComp(){

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = {
        email: email,
        message: message,
      };

      if(formData.email === "" || formData.message === ""){
        Swal.fire('Error', 'Please fill a message.', 'error');
        return;
      }
      axios.post('http://localhost:8080/shop/contactUs/send', formData)
      .then((response) => {
        Swal.fire('Message Sent!', 'Thank you for contacting us! please check your email within 24 hours.', 'success');
        console.log(response.data);
      })
      .catch((error) => {
        Swal.fire('Error Occurred', 'Something went wrong.', 'error');
        console.error(error);
      });
    
    };
    return(
        <div className="body">
          <div className="col-12 loginBox mb-5">
            <div className="col-12 d-flex justify-content-center">
              <div className="col-4 my-auto px-5">
                <p className="display-3">
                  Where to find us
                </p>
                <hr />
                <p className="lead">
                Pacific Century Place Tower Lt. 26 SCBD (Sudirman Central Business District) Lot 10, Jl. Jenderal Sudirman No.52-53, Senayan, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12190
                </p>
              </div>
              <div className="col-8">
              <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31730.18422868346!2d106.77022897431638!3d-6.227689000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f692356a22b3%3A0xdf0d881fd6c3e2e4!2sShopee%20Indonesia!5e0!3m2!1sid!2sid!4v1695924650122!5m2!1sid!2sid"
        // width="600"
        height="400"
        className="col-12 rounded-5"
        style={{ border: '0' }}
        allowFullScreen=""
        loading="lazy"
        title="Google Map"
      ></iframe>
              </div>
            </div>
          </div>
            <div className="col-12 d-flex justify-content-center">
                <div className="col-5 loginBox me-5">
                    <h1 className="display-6 fw-bold teksoren">
                        Contact us
                    </h1>
                    <hr />
                    <p className="lead teksoren"><a href="#" className="linkprimary "><Icon.EnvelopeAtFill className="lead me-2"/> support@shopp.com</a></p>
                    <p className="lead teksoren"><a href="#" className="linkprimary"><Icon.TelephoneFill className="lead me-2"/> +65 04433 9911</a></p>
                    <p className="lead teksoren"><a href="#" className="linkprimary"><Icon.Instagram className="lead me-2"/> @shoppofficial</a></p>
                    <p className="lead teksoren"><a href="#" className="linkprimary"><Icon.Linkedin className="lead me-2"/> Shopp Company</a></p>
                    <p className="lead teksoren"><a href="#" className="linkprimary"><Icon.Facebook className="lead me-2"/> @shoppofficial</a></p>
                    <p className="lead teksoren"><a href="#" className="linkprimary"><Icon.Youtube className="lead me-2"/> Shopp Official</a></p>
                </div>

                <div className="col-6 loginBox">
                <h1 className="display-6 fw-bold teksoren">
                       Send us a message
                    </h1>
                    <hr />
                    <Form onSubmit={handleSubmit}>
                        <Form.Floating className="mb-3">
                            <Form.Control 
                            type="email"
                            name="userName"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="">Email Address</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control 
                            style={{height:"200px"}}
                            as="textarea"
                            placeholder="Any issue you are experiencing?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            />
                            <label htmlFor="">Any issue you are experiencing?</label>
                        </Form.Floating>

                        <Button type="submit" variant="" className="btnOren col-6">Submit <Icon.SendFill className="ms-2 mb-1" /></Button>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default ContactUsComp;