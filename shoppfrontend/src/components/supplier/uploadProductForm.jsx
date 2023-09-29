import { Form, Button } from "react-bootstrap"
import React, {useState, useEffect} from "react"
import axios from "axios"
import Swal from "sweetalert2"
import * as Icon from "react-bootstrap-icons"

export const UploadProductForm = () => {
    
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


  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productType, setProductType] = useState("")
  const [stock, setProductStock] = useState("")
  const [price, setProductPrice] = useState("")

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);

    if (imageFile) {
      const imageURL = URL.createObjectURL(imageFile);
      setImagePreview(imageURL);
    }
  };

  const handleCancleImage = (event) => {
    setSelectedImage(null);
    setImagePreview(null);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productType", productType);
    formData.append("stock", stock);
    formData.append("price", price);

    if(selectedImage){
      formData.append("productImage", selectedImage)
    }

    axios.post(`http://localhost:8080/shop/add-product?email=${sessionUser.email}`, formData, config)
    .then(response => {
      Swal.fire({
        icon: "success",
        title: "Product added!",
        footer: "",
        confirmButtonColor: "#127d3f",
        confirmButtonText: "Ok",
        preConfirm: () => {
          return new Promise((resolve) => {
            window.location.href="/profile";
          });
        },
      });
      console.log("Product added:", response.data);
    })
    .catch(error => {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        footer: "",
        confirmButtonColor: "#127d3f",
        confirmButtonText: "Ok",
        preConfirm: () => {
          return new Promise((resolve) => {
            window.location.reload();
            resolve();
          });
        },
      });
      console.error("Error uploading product:", error);
    });
  }



    return(
        <>
        <Form onSubmit={handleSubmit}>
          <p className="display-6 py-4 ms-4">New Product</p>
          <div className="d-flex col-12">


            <div className="col-6 px-4">
              <Form.Floating className="mb-3 col-12">
                <Form.Control 
                type="text"
                placeholder="What is it called?"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                />
                <label htmlFor="">What is it called?</label>
              </Form.Floating>


              <Form.Floating className="mb-3 col-12">
                <Form.Control 
                as="textarea"
                style={{height:"400px"}}
                placeholder="Any description for your product?"
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
                />
                <label htmlFor="">Any description for your product?</label>
              </Form.Floating>

              <Form.Floating className="mb-3 col-12">
                <Form.Control 
                type="number"
                placeholder="Set your price"
                value={price}
                onChange={e => setProductPrice(e.target.value)}
                />
                <label htmlFor="">Set your price</label>
              </Form.Floating>


              <Form.Floating className="mb-3 col-12">
                <Form.Control 
                type="number"
                placeholder="How many stocks are you selling?"
                value={stock}
                onChange={e => setProductStock(e.target.value)}
                />
                <label htmlFor="">How many stocks are you selling?</label>
              </Form.Floating>

            </div>

            <div className="col-6 px-4">
            {imagePreview &&
          <div className="d-flex justify-content-center">
            <div className="col-11 mx-auto">
              <div className="d-flex">
              <p className="lead mb-2 col-11"> {selectedImage.name.toString()} </p>
              <Icon.X  className="display-6 text-center col-1 mb-1" onClick={handleCancleImage}/>
              </div>
            <img src={imagePreview} style={{scale:"80%"}} className="col-12 rounded-5" alt="Preview" />
            </div>
          </div>
        }
        <Form.Group className="mb-3">
          <Form.Label>Add an image for your product</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>


        <Form.Floating className="mb-3 col-12">
                <Form.Select 
                placeholder="Please select a type for your product."
                value={productType}
                onChange={e => setProductType(e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="ELECTRONIC">Electronics & Gadgets</option>
                  <option value="FOOD"> Foods & Beverages</option>
                  <option value="HARDWARE"> Hardware </option>
                  <option value="VEHICLE"> Automotives </option>
                  <option value="SKINCARE"> Skincare </option>
                  <option value="SOAP"> Bodywash </option>
                  <option value="FURNITURE"> Furnitures </option>
                  <option value="TOYS"> Kids play & Toys </option>
                  <option value="ACCESSORIES"> Accessories </option>
                  <option value="STATIONERY"> Stationery </option>
                  <option value="MEDIA"> Films and Music </option>

                </Form.Select>
                <label htmlFor="">Please select a type for your product.</label>
        </Form.Floating>
            </div>
          </div>
          <div className="d-flex justify-content-end">
        <Button variant="" className="mt-2 btnOren col-2" type="submit">Add <Icon.PlusLg className="ms-2 mb-1"/></Button>
        </div>
        </Form>
        </>
    )
}