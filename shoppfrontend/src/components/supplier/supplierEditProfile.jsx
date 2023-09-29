import { Button, Form } from "react-bootstrap"
import axios from "axios";
import React, {useState, useEffect} from "react";
import Swal from "sweetalert2";
import * as Icon from "react-bootstrap-icons"
import MapModal from "../../utils/map";
import profileImg from '../../img/oneshop.jpg'



export const SupplierEditProfile = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };

    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
     };

      const [selectedImage, setSelectedImage] = useState(null);
      const [imagePreview, setImagePreview] = useState(null);
      const [selectedInputName, setSelectedInputName] = useState(""); 



      const [userInfo, setUserInfo] = useState(null); 
      const [supplier, setSupplier] = useState(null); 
      const [addressInfo, setAddressInfo] = useState({
        road: "",
        village: "",
        subdistrict: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
        latitude: 0,
        longitude: 0,
      });

      const [formData, setFormData] = useState({
        name: "",
        age: "",
        phoneNumber: "",
        });


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
    
      useEffect(() => {
        axios
          .get(`http://localhost:8080/shop/get-supplier/${sessionUser.email}`, {
            headers,
          })
          .then((response) => {
            console.log(response.data);
            const supplierInfo = response.data;
            setSupplier(supplierInfo);
            setFormData({
                name: (supplierInfo && supplierInfo.companyName) || "",
                phoneNumber: (supplierInfo && supplierInfo.companyNumber) || "",
              });
    
            setMapData({
                ...mapData,
                addressInfo: {
                    road: supplierInfo.road || "",
                    village: supplierInfo.village || "",
                    subdistrict: supplierInfo.subdistrict || "",
                    city: supplierInfo.city || "",
                    state: supplierInfo.state || "",
                    country: supplierInfo.country || "",
                    postcode: supplierInfo.postcode || "",
                  },  
                latitude: supplierInfo.latitude || 0,
                longitude: supplierInfo.longitude || 0,
              });
            

          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

     
      

      const handleFieldChange = (field, value) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
      };
      
      const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        setSelectedImage(imageFile);
    
        if (imageFile) {
          const imageURL = URL.createObjectURL(imageFile);
          setImagePreview(imageURL);
        }
      };
    
      const handleCancelImage = (event) => {
        setSelectedImage(null);
        setImagePreview(null);
      };



    //   MAPP

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

      const openMapModal = (name) => {
        setShowMapModal(true);
        setMapData({
          ...mapData,
          selectedInputName: name,
        });
      };
      
  const closeMapModal = () => {
    setShowMapModal(false);
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



//   MAP 

      const handleProfileUpdate = async () => {


    

        const formDataToSend = new FormData();
      
        if (selectedImage) {
          formDataToSend.append("profilePicture", selectedImage);
        }
      
        formDataToSend.append("companyName", formData.name);
        formDataToSend.append("companyNumber", formData.phoneNumber);


        if (!isNaN(mapData.latitude) && !isNaN(mapData.longitude)) {
          formDataToSend.append("latitude", mapData.latitude);
          formDataToSend.append("longitude", mapData.longitude);
        } else {
          console.error("Invalid latitude or longitude");
          return;
        }


      
        // Append the address fields
        formDataToSend.append("road", mapData.addressInfo.road);
        formDataToSend.append("village", mapData.addressInfo.village);
        formDataToSend.append("subdistrict", mapData.addressInfo.suburb);
        formDataToSend.append("city", mapData.addressInfo.city);
        formDataToSend.append("state", mapData.addressInfo.state);
        formDataToSend.append("country", mapData.addressInfo.country);
        formDataToSend.append("postcode", mapData.addressInfo.postcode);
      
        try {
          const response = await axios.post(
            `http://localhost:8080/shop/edit-profile/supplier?email=${sessionUser.email}`,
            formDataToSend,
            {
              headers: {
                ...headers,
                "Content-Type": "multipart/form-data",
              },
            }
          );
      
          console.log(response.data);
      
          // Update the session data with the new profile information
          const updatedUser = { ...sessionUser };
          updatedUser.name = formData.name; // Update the name field
          // Update other fields as needed
      
          sessionStorage.setItem('loginFormData', JSON.stringify(updatedUser));
      
          Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been updated successfully",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
            preConfirm: () => {
              return new Promise((resolve) => {
                // Redirect or close the modal as needed
                // For example, you can redirect to a new page
                window.location.href = "/profile";
                resolve();
              });
            },
          });
        } catch (error) {
          console.error("Error updating profile:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update profile",
            confirmButtonColor: "#127d3f",
            confirmButtonText: "Ok",
          });
        }
      };
      
      

      const [showMapModal, setShowMapModal] = useState(false);

    const handleShowMapModal = () => {
        setShowMapModal(true);
    };

    return(
        <div>
            <div className="body pt-5">
            {userInfo && userInfo.userDetails && supplier && (

            <div className="col-12 d-flex ">

                    <div className="col-5 px-2">
                        <div  className="loginBox p-5">
                        <div>
                        <p className="lead mb-3">Profile Image Preview</p>
                        <div className="col-12  d-flex justify-content-center">
                            <div className="col-10 ">
                            <div className="d-flex mx-auto">
                            <Icon.X  className="display-6 text-center col-1 mb-1" onClick={handleCancelImage}/>
                            </div>
                            <div className="d-flex justify-content-center mx-auto mb-5">
                                {imagePreview && (
                                <img src={imagePreview} style={{scale:"100%", borderRadius:"50%"}} className="col-12 profilePreview" alt="Preview" />
                                )}
                                {!imagePreview && userInfo.profilePicture &&(
                                <img src={`data:image/jpeg;base64,${userInfo.profilePicture}`} style={{scale:"100%", borderRadius:"50%"}} className="col-12 profilePreview" alt="Preview" />
                                )}
                                 {!imagePreview && !userInfo.profilePicture &&(
                                <img src={profileImg} style={{scale:"100%", borderRadius:"50%"}} className="col-12 profilePreview" alt="Preview" />
                                )}
                            </div>
                            </div>
                            
                        </div>
                        </div>
                        <Form.Group className="mb-3">
                        <Form.Label>Choose a store image</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                        </Form.Group>
                        </div>

                    </div>
                    <div className="col-7 p-5 loginBox my-auto">
                    <p className="lead mb-4">Setting up your Store, {sessionUser.email}?</p>
                            <Form>
                            <Form.Floating className="mb-3">
                            <Form.Control
                                name="name"
                                type="text"
                                placeholder="Enter your Company or Store name"
                                value={formData.name} // Use formData for value
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                            />
                            <label htmlFor="">Enter your Company or Store name</label>
                            </Form.Floating>

                            <Form.Floating className="mb-3">
                            <Form.Control
                                name="phoneNumber"
                                type="text"
                                placeholder="Company Number"
                                value={formData.phoneNumber} // Use formData for value
                                onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                            />
                            <label htmlFor="">Company Number</label>
                            </Form.Floating>

                            <p className="lead mt-5">Moving somewhere?</p>
                            <p className=" mt-3"> <span className="lead">Your location: </span><br /> <p>{`${mapData.addressInfo.road || ""} ${mapData.addressInfo.village || ""} ${
                            mapData.addressInfo.city_district || mapData.addressInfo.city || ""
                            } ${mapData.addressInfo.state || ""} ${mapData.addressInfo.country || ""} ${
                            mapData.addressInfo.postcode || ""
                            }`}</p>
                            </p>
                            <Button onClick={() => handleShowMapModal("mapLocation")} className="col-12 btnOren" variant="">
                            Set my new location <Icon.GeoAltFill className="mb-1" />
                            </Button>

                            <div className="d-flex justify-content-end mt-5">
                                <Button variant="" onClick={handleProfileUpdate} className="btnBiru">Edit Profile</Button>
                            </div>
                            </Form>
                    </div>
                </div>
                    )}

            </div>

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
            show={showMapModal}
            handleClose={closeMapModal}
            />

        </div>
    )
}