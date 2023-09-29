import { Button, Form } from "react-bootstrap"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MyProductsList } from "../../components/supplier/myProductsList"
import * as Icon from "react-bootstrap-icons"
import Header from "../../components/user/header"
import Swal from "sweetalert2";
import { NotFound } from "../user/notFound";

export const MyProductsPage = () => {

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };


    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    const [myProducts, setMyProducts] = useState([])

  
    useEffect(() => {
      axios.get(`http://localhost:8080/shop/all-products/supplier/${sessionUser.email}`, { headers })
        .then((response) => {
          console.log(response.data)
          setMyProducts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);


    const handleSearch = () => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = myProducts.filter((product) => {
          const productTypeMatch = product.productType.toLowerCase().includes(lowercasedQuery);
          const productNameMatch = product.productName.toLowerCase().includes(lowercasedQuery);
          const priceMatch = product.price.toString().includes(searchQuery);
      
          return productTypeMatch || productNameMatch || priceMatch;
        });
      
        setFilteredResults(filtered);
      };

      const handleDeleteProduct = (productId) => {
        axios.delete(`http://localhost:8080/shop/delete-product/${productId}`, { headers })
              .then(response => {
      
                  Swal.fire({
                      icon: 'success',
                      title: 'Deleted',
                      text: 'Product deleted successfully',
                      confirmButtonColor: "#127d3f",
                          confirmButtonText: "Ok",
                          preConfirm: () => {
                            return new Promise((resolve) => {
                              window.location.reload();
                              resolve()
                            });
                          },
                    });
              })
              .catch(error => {
                  Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Failed to delete product',
                      confirmButtonColor: "#127d3f",
                          confirmButtonText: "Ok",
                          preConfirm: () => {
                            return new Promise((resolve) => {
                              window.location.reload();
                              resolve()
                            });
                          },
                    });
                  console.error(error);
              });
      }
      

    return(
        <>
        <Header activePage={"myProducts"} />
        {sessionUser.role === "SUPPLIER" && (
 <div className="body">
 <p className="display-6 mb-4 teksoren">My Products <Icon.Bag className="mb-2"/></p>
 <div className="d-flex justify-content-center col-12">
     <div className="col-4 loginBox bg-light p-4">
         <p className="lead mb-4 teksoren">Explore</p>
         {myProducts && (
         <Form className="col-12 d-flex">
         <Form.Floating className="col-10">
             <Form.Control
             type="search"
             placeholder="Search"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             />
             <label htmlFor="">Search..</label>
         </Form.Floating>
         <Button
             variant=""
             className="btnOren col-2 ms-2"
             onClick={handleSearch}
         >
             <Icon.Search />
         </Button>
         </Form>
         )}


         <hr />
         <div className="col-10 mx-auto">
         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Electronics & Gadgets
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Foods & Beverages
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Hardware
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Automotives
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Skincare
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Bodywash
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Furnitures
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Kids play & Toys
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Accessories
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Stationery
             </p>
         </div>

         <div className="adminBox bg-white my-3 p-2">
             <p className="lead teksprimary text-center fw-bold my-auto">
             Films and Music
             </p>
         </div>
         </div>
         
         
     </div>
     <div className="col-8">
     <div className="col-12 px-5 overflowContent2">
         {searchQuery && (
             <>
             <p className="lead">You searched for {searchQuery}</p>
                 {filteredResults.length > 0 ? (
                     
                 filteredResults.map((products) => (
                     <>
                     <div key={products.productId} className="loginBox bg-light mb-4">
                         <div className="d-flex">
                             <div className="col-6 px-5 my-auto">
                                 <img src={`data:image/jpeg;base64,${products.productImage}`} alt="" className="col-12 rounded-5" />
                                 <p className="display-6 my-2">${products.price}</p>
                                 <p className="lead">Stock available: {products.stock}</p>

                                 <div className="d-flex justify-content-center mt-4">
                                 <Button href={`/editProduct/${products.productId}`} variant="" className="col-6 me-1 btnBiru">Edit</Button>
                                 <Button onClick={() => handleDeleteProduct(products.productId)} variant="" className="col-6 btn-danger">Delete</Button>
                                 </div>
                             
                             </div>

                             <div className="col-6">
                                 <div className="loginBox">
                                 <p className="display-6">
                                     {products.productName}
                                 </p>
                                 <hr />
                                 <div className="overflowContent px-4">
                                 <article>{products.productDescription}</article>

                                 </div>
                                 </div>

                                 

                             </div>
                         </div>
                     </div>
                     </>
                 ))
                 ) : (
                     
                     null
                 )}
             </>
         )}
     

     </div>
     {!searchQuery && filteredResults.length === 0 && (
         <MyProductsList />

     )}
     </div>
 </div>
</div>
        )}

        {sessionUser.role !== "SUPPLIER" && (
            <NotFound />
        )}
       
        </>
    )
}