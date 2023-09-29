import { Button, Form, Modal } from "react-bootstrap"
import axios from "axios";
import React, {useState, useEffect} from "react";
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"
import MapModal from "../../utils/map";
import profileImg from '../../img/profile.jpg'
import store from '../../img/oneshop.jpg'


export const EditUserModalBuyer =  ({show, onHide, selectedUser })  => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };
    
    const[userData, setUserData] = useState({
        name: '',
        age:'',
        phoneNumber:"",
    })
    const [userInfo, setUserInfo] = useState(null); 



    useEffect(() => {
        if (selectedUser) {
          axios
            .get(`http://localhost:8080/shop/user-info/${selectedUser.email}`, { headers })
            .then((response) => {
              console.log(response.data);
              setUserInfo(response.data);
              setUserData({
                name: response.data.userDetails.name || '',
                age: response.data.userDetails.age || '',
                phoneNumber: response.data.userDetails.phoneNumber || '',
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }, [selectedUser]);

    const handleSubmit = (e) => {
        e.preventDefault()
        axios
        .post(`http://localhost:8080/shop/edit-user?userId=${selectedUser.userId}`, userData, { headers })
        .then((response) => {
          console.log(response.data);
          setUserData(response.data);
          Swal.fire({
            icon: "success",
            title: "User edited!",
            footer: "",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
            preConfirm: () => {
                window.location.reload();
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

    const handleDefaultPicture = () => {

        axios
    .put(`http://localhost:8080/shop/delete-profile-picture/${selectedUser.userId}`,{}, { headers })
    .then((response) => {
        console.log(response.data);
        setUserData(response.data);
        Swal.fire({
            icon: "success",
            title: "Success",
            confirmButtonText: "Ok",
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

    const handleFieldChange = (field, value) => {
        setUserData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
      };
    
    return(
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    

                {userInfo && (
                    <>
                    <p className="lead">Profile Picture</p>
                    <div className="d-flex justify-content-center my-3">
                    {userInfo.profilePicture && (
                            <img src={`data:image/jpeg;base64,${userInfo.profilePicture}`} style={{ scale: "100%", borderRadius: "50%" }} className="col-12 profilePreview" alt="Preview" />
                        )}
                        {!userInfo.profilePicture && userInfo.role === "BUYER" && (
                            <img src={profileImg} style={{ scale: "100%", borderRadius: "50%" }} className="col-12 profilePreview" alt="Preview" />
                        )}
                        {!userInfo.profilePicture && userInfo.role === "SUPPLIER" && (
                            <img src={store} style={{ scale: "100%", borderRadius: "50%" }} className="col-12 profilePreview" alt="Preview" />
                        )}
                    </div>
                    <div className="d-flex justify-content-center">
                    <Button onClick={handleDefaultPicture} variant="" className="btnBiru mb-5">Set to default profile</Button>

                    </div>

                     <Form className="col-12" onSubmit={handleSubmit}>
                               <Form.Floating className="mb-3">
                                    <Form.Control 
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Edit name"
                                        value={userData.name}
                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                    />
                                    <label htmlFor="name">Edit name</label>
                                </Form.Floating>

                                <Form.Floating className="mb-3">
                                    <Form.Control 
                                        type="number"
                                        id="age"
                                        name="age"
                                        placeholder="Edit age"
                                        value={userData.age}
                                        onChange={(e) => handleFieldChange('age', e.target.value)}
                                    />
                                    <label htmlFor="age">Edit age</label>
                                </Form.Floating>

                                <Form.Floating className="mb-3">
                                    <Form.Control 
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="Edit phone number"
                                        value={userData.phoneNumber}
                                        onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                    />
                                    <label htmlFor="phoneNumber">Edit phone number</label>
                                </Form.Floating>


                             </Form>
                    </>

                  )}
                    
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={handleSubmit} variant="" className="btn-success  mt-4">
                                    Save Changes
                                </Button>
                <Button onClick={onHide} variant="" className="btn-danger  mt-4">
                    Cancel
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}