import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Modal, Row, Col, Form, Carousel, Card, Placeholder, Spinner } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import profileImg from '../../img/profile.jpg'
import { CarouselMain } from "../buyer/carousel";
import { CardLoading } from "../../utils/cardLoading";
import storeImg from '../../img/oneshop.jpg'

export const AllProducts = () => {
  const sessionUser = JSON.parse(sessionStorage.getItem("loginFormData"));
  const token = sessionUser.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [shoppPay, setShoppPay] = useState(null)
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([])
  const[showAlert, setShowAlert] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
  
    // Filter stores
    const filteredStores = suppliers.filter((store) => {
      const companyNameMatch = store.companyName?.toLowerCase().includes(lowercasedQuery);
      const cityMatch = store.city.toLowerCase().includes(lowercasedQuery);
      const stateMatch = store.state.toLowerCase().includes(lowercasedQuery);
      const countryMatch = store.country.toLowerCase().includes(lowercasedQuery);
      const postcodeMatch = store.postcode.toLowerCase().includes(lowercasedQuery);
  
      return companyNameMatch || cityMatch || stateMatch || countryMatch || postcodeMatch;
    });
  
    // Filter products
    const filteredProducts = products.filter((product) => {
      const productTypeMatch = product.productType.toLowerCase().includes(lowercasedQuery);
      const productNameMatch = product.productName.toLowerCase().includes(lowercasedQuery);
      const priceMatch = product.price.toString().includes(searchQuery);
  
      // Include company name in product search criteria
      const companyNameMatch = product.supplier.companyName.toLowerCase().includes(lowercasedQuery);
  
      return (
        productTypeMatch ||
        productNameMatch ||
        priceMatch ||
        companyNameMatch
      );
    });
  
    setFilteredStores(filteredStores);
    setFilteredProducts(filteredProducts);
  };
  
  useEffect(() => {
    axios
      .get("http://localhost:8080/shop/all-products", { headers })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/shop/all-stores", { headers })
      .then((response) => {
        console.log(response.data);
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [userInfo, setUserInfo] = useState(null); 
  useEffect(() => {
    axios.get(`http://localhost:8080/shop/user-info/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setUserInfo(response.data);
        setShowAlert(response.data.active === false)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/shoppPay-account/${sessionUser.email}`, { headers })
      .then((response) => {
        console.log(response.data)
        setShoppPay(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    
    <div className="container">
      
    <CarouselMain />

     <div className=" pt-2 pb-4">
    <p className="display-6 teksoren">Explore <Icon.Search /></p>
     <Form className="d-flex mt-3">
      <Form.Floating className="col-10">
        <Form.Control
          type="text"
          placeholder="Search.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label htmlFor="">Search..</label>
      </Form.Floating>
      <Button variant="" className="btnOren col-2" onClick={handleSearch}>
        Search
      </Button>
    </Form>

     </div>
     {searchQuery ? (
     <div className="SEARCHRESULT container">
        <Row className="col-12 d-flex justify-content mb-3">
        <p className="lead">Search results of "{searchQuery}"</p>
      <div className="overside2 py-3 col-12">
        <div className="col-12 d-flex">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            store.companyName !== null && (
              <>
                          <a href={`/store/${store.supplierId}`} className="linkprimary text-dark" key={store.supplierId}>
                                <div className="storeBox me-3 ">
                                  <div className="col-12 d-flex justify-content-center">
                                  <div className="col-4 my-auto d-flex justify-content-center">
                              {store.companyImage && (
                                <img src={`data:image/jpeg;base64,${store.companyImage}`} alt="" className="profileDash2" />
                              )}
                              {store.companyImage === null &&  (
                                <img src={storeImg} alt="" className="profileDash2" />
                              )}
                              {console.log("companyImage:", store.companyImage)}
                            </div>
              
                                    <div className="col-8 px-3">
                                      <p className="display-6">{store.companyName}</p>
                                      <small><Icon.GeoAltFill className="mb-1" /> {store.city || ""}, {store.state || ""}, {store.country || ""}. <br /> {store.postcode || ""}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </a>
                          </>
                          )
            
          ))
        ) : (

          null
        
        )}
        </div>
      
      </div>
        </Row>
        <Row className="col-12 d-flex justify-content ">
          {filteredProducts.length > 0 ? (
            <>
              {filteredProducts.map((product) => (
                <Col className="me-4" key={product.productId} lg={2} md={4} sm={6} xs={12}>
                <Card style={{height:"380px"}}  className="productBox bg-white mb-4">
                  <a
                   href={`/productDetails/${product.productId}`}
                   className="linkprimary "
                  >
                    <img
                      src={`data:image/jpeg;base64,${product.productImage}`}
                      alt=""
                      className="col-12 rounded-5 productImg"
                    />
                    <p className="text-dark col-12 mt-2">{product.productName}</p>
                    <p className="lead fw-bold mb-1 text-dark">${product.price}</p>
                    <p className="teksprimary mb-3">{product.stock} stocks left</p>
                    <p className="teksoren fw-bold">
                      <Icon.GeoAltFill className="mb-1" /> {product.supplier.companyName}
                    </p>
                  </a>
                </Card>
              </Col>
              ))}
            </>
          ) : (
            <div className="d-flex justify-content">
              <CardLoading />
            </div>
          )}
        </Row>
     </div>
     ) : (
     <>
     <Row className="col-12 d-flex justify-content container mb-5">
     <p className="display-6 fw-bold mb-4 teksoren">Stores</p>

        <div className="overside2 py-3 col-12">
          <div className="d-flex col-12">
          {suppliers.length? (
           <>
             {suppliers.map((store)=>(
           store.companyName !== null && (
            <>
                        <a href={`/store/${store.supplierId}`} className="linkprimary text-dark" key={store.supplierId}>
                              <div className="storeBox me-3 ">
                                <div className="col-12 d-flex justify-content-center">
                                <div className="col-4 my-auto d-flex justify-content-center">
                            {store.companyImage && (
                              <img src={`data:image/jpeg;base64,${store.companyImage}`} alt="" className="profileDash2" />
                            )}
                            {store.companyImage === null &&  (
                              <img src={storeImg} alt="" className="profileDash2" />
                            )}
                            {console.log("companyImage:", store.companyImage)}
                          </div>
            
                                  <div className="col-8 px-3">
                                    <p className="display-6">{store.companyName}</p>
                                    <small><Icon.GeoAltFill className="mb-1" /> {store.city || ""}, {store.state || ""}, {store.country || ""}. <br /> {store.postcode || ""}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </a>
                        </>
                        )
          ))}
           </>
          ):(
            <div className="d-flex justify-content">
              <CardLoading />
            </div>
          )}

        
          </div>
      
        </div>

       </Row>
       <div className="ps-2">
       <Row className="col-12 d-flex justify-content ms-5">
      <p className="display-6 fw-bold mb-4 teksoren">Products</p>

          {products.length ? (
              <>
              {products.map((product) => (
                        <Col className="me-4" key={product.productId} lg={2} md={4} sm={6} xs={12}>
                          <Card style={{height:"380px"}}  className="productBox bg-white mb-4">
                            <a
                              href={`/productDetails/${product.productId}`}
                              className="linkprimary "
                            >
                              <img
                                src={`data:image/jpeg;base64,${product.productImage}`}
                                alt=""
                                className="col-12 rounded-5 productImg"
                              />
                              <p className="text-dark col-12 mt-2">{product.productName}</p>
                              <p className="lead fw-bold mb-1 text-dark">${product.price}</p>
                              <p className="teksprimary mb-3">{product.stock} stocks left</p>
                              <p className="teksoren fw-bold">
                                <Icon.GeoAltFill className="mb-1" /> {product.supplier.companyName}
                              </p>
                            </a>
                          </Card>
                        </Col>
                      ))}
              </>
          ):(


           <>
           <div className="d-flex justify-content">
              <CardLoading />
            </div>
          </>
          

            
          )}

       </Row>
       </div>
         
       </>
     )}
    </div>
  );
};
