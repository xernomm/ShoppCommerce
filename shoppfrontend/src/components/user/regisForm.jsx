import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import MapModal from "../../utils/map";
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"

export const RegisForm = () => {

  const questions = [
    { key: "name", question: "What's your name?" },
    { key: "age", question: "How old are you?", type: "number" },
    { key: "email", question: "What's your email?", type: "email" },
    { key: "phoneNumber", question: "What's your phone number?" },
    { key: "role", question: "Why are you joining us?", type: "select", options: ["BUYER", "SUPPLIER"] },
    { key: "mapLocation", question: "Where do you live?" }, 
    { key: "password", question: "Create your password", type: "password" },
    { key: "confirmPassword", question: "Confirm your password", type: "password" },
  ];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleBack = () => {
    const currentKey = questions[currentQuestion].key;
    const currentValue = formData[currentKey];

    setFormData({
      ...formData,
      [currentKey]: currentValue,
    });

    setCurrentQuestion(currentQuestion - 1);

  }

  const handleNext = () => {
    const currentKey = questions[currentQuestion].key;
    const currentValue = formData[currentKey];

    // Check if the field is empty
    if (!currentValue) {
      Swal.fire("Oops.. Sorry!", "Please fill in the field.", "warning");
      return;
    }

    if(currentKey === "email"){

      const checkMail = {
        email: formData.email
      }

       axios.post(
          "http://localhost:8080/shop/check-email-exist",
          checkMail
        ).then((response) => {
        console.log(response.data)
        console.log("Email found:", checkMail);

        })
      .catch ((error) => {
        console.error("Email not found:", error);
        console.log(error.response.data.message);
        if (error.response.data.message === 'Email in use.') {
          Swal.fire({
            icon: 'error',
            title: 'Email already in use',
            text:
              "Please enter another email",
            footer: '<a href="/getStarted">Register</a>',
            preConfirm: () => {
              return new Promise((resolve) => {
                window.location.href = "/getStarted";
                resolve();
              });
            },
          });
          return;
        }
      })
    }

    if (currentKey === "password") {
      const passwordValue = formData[currentKey];
    
      // Password pattern with the specified requirements
      const passwordPattern = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z]).{8,10}$/;
    
      // Check if the password matches the pattern
      if (!passwordPattern.test(passwordValue)) {
        Swal.fire(
          "Invalid Password",
          "Password should be 8-10 characters long, contain at least one symbol and one uppercase letter.",
          "error"
        );
        return;
      }
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

    setCurrentQuestion(currentQuestion + 1);
  };

  
  
      
      const [mapData, setMapData] = useState({
        latitude: 0,
        longitude: 0,
        addressInfo: {
          road: "",
          village: "",
          subdistrict: "",
          city: "",
          state: "",
          country: "",
          postcode: "",
        },
      });
      

      const [showModal, setShowModal] = useState(false);


      const openMapModal = (name) => {
        setShowModal(true);
        setMapData({
          ...mapData,
          selectedInputName: name,
        });
      };
      
      
      
      

  const closeMapModal = () => {
    setShowModal(false);
  };

      
      const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
      const handleMapDataChange = (lat, lng, address) => {
        // Access the properties directly from the 'address' object
        const { road, village, country, subdistrict, city, state, postcode } = address;
      
        // Update the mapData state
        setMapData({
          latitude: lat,
          longitude: lng,
          addressInfo: {
            road: road || "",
            village: village || "",
            country: country || "",
            subdistrict: subdistrict || "",
            city: city || "",
            state: state || "",
            postcode: postcode || "",
          },
        });
      
        // Update the corresponding input field's value
        setFormData({
          ...formData,
          mapLocation: `${road || ""} ${village || ""} ${
            subdistrict || city || ""
          } ${state || ""} ${country || ""} ${
            postcode || ""
          }`,
        });
      };

      const handleCheckEmail = () => {

      }
      
      
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const registrationData = {
          name: formData.name,
          age: formData.age,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          road: mapData.addressInfo.road || null,
          village: mapData.addressInfo.village || null,
          subdistrict: mapData.addressInfo.suburb || null,
          city: mapData.addressInfo.city || null,
          state: mapData.addressInfo.state || null,
          country: mapData.addressInfo.country || null,
          postcode: mapData.addressInfo.postcode || null,
          latitude: mapData.latitude || null,
          longitude: mapData.longitude || null,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          mapLocation: formData.mapLocation,
        };
        ;
      
        try {
          const response = await axios.post(
            "http://localhost:8080/shop/register",
            registrationData
          );
          console.log(response.data)
          await new Promise((resolve) => setTimeout(resolve, 300));
          console.log("Registration successful:", registrationData);
          Swal.fire('Registration Success', '', 'success').then(() => {
            window.location.href = '/login';
          });
        } catch (error) {
          console.error("Registration failed:", error);
          Swal.fire("Error!", "Registration failed.", "error").then(() => {
            window.location.href = '/';
          });
        }
      };
      

      return (
        <div className="col-12">
      {questions.map((q, index) => (
  <div key={q.key} style={{ display: index === currentQuestion ? "block" : "none" }}>

<div className="mb-3">
  {q.type === "select" ? (
    <div>
    <p className="teksprimary mb-2">Please answer these questions  ({currentQuestion + 1}/8)</p>
    <Form.Floating>
      <Form.Select
        id={q.key}
        name={q.key}
        value={formData[q.key] || ""}
        placeholder={q.question}
        onChange={handleFormChange} 
      >
        <option value="">Select answer</option>
        <option value="BUYER">I just want to find goods and stuff.</option>
        <option value="SUPPLIER">I have a store and a product. I'm here to be a supplier</option>
      </Form.Select>
    <label htmlFor={q.key}>{q.question}</label>
    </Form.Floating>
    </div>
  ) : (
    <div>
    <p className="teksprimary mb-4">Please answer these questions ({currentQuestion + 1}/8)</p>
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
    
    
  )}
</div>


    {q.key === "mapLocation" && formData.mapLocation && (
      <div  className="d-flex justify-content-center mt-4">
        <div className="col-12">
          <p className="lead mt-3">
            {`${mapData.addressInfo.road || ""} ${mapData.addressInfo.village || ""} ${
              mapData.addressInfo.city_district || mapData.addressInfo.city || ""
            } ${mapData.addressInfo.state || ""} ${mapData.addressInfo.country || ""} ${
              mapData.addressInfo.postcode || ""
            }`}
          </p>
          <Button
            name={q.key} 
            variant=""
            className="btnPrimary col-12"
            onClick={() => openMapModal(q.key)} 
          >
            Select Location on Map <Icon.GeoAltFill className="mb-1" />
          </Button>
        </div>
      </div>
    )}
    <div className="d-flex justify-content-end mt-4">
    <Button variant="" className="btn-secondary col-2 mx-2"
       onClick={handleBack}
       >
        Back
      </Button>

      <Button variant="" className="btnBiru col-2 mx-2"
       onClick={handleNext}
       
       >
        Next
      </Button>

    </div>
    <a href="/login" className="lead linkprimary">Already have an account?</a>

  </div>
))}









      {currentQuestion === questions.length && (
        <div className="d-flex justify-content-center mt-4">
          <div className="col-12">
            <p className="lead mb-3">Almost done! you can now submit your information</p>
            <Button variant="" className="btnBiru col-12" onClick={handleSubmit}>
              Submit <Icon.SendCheckFill />
            </Button>
          </div>
        </div>
      )}


<MapModal
  latitude={mapData.latitude}
  longitude={mapData.longitude}
  onSelectLocation={(lat, lng, address) => {
    const { selectedInputName } = mapData;
    handleMapDataChange(lat, lng, address, selectedInputName);
    closeMapModal();
  }}
  setAddressInfo={(info) => {
    setMapData({
      ...mapData,
      addressInfo: info,
    });
  }}
  show={showModal}
  handleClose={closeMapModal}
/>
    </div>
      );
      
}