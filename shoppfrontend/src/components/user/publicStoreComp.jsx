import { Button, Col, Row, Spinner } from "react-bootstrap"
import * as Icon from "react-bootstrap-icons"
import { useParams } from 'react-router-dom';
import React, {useState, useEffect} from "react";
import axios from "axios";
import Header from "../../components/user/header";
import Swal from "sweetalert2";
import store from '../../img/oneshop.jpg'


export const PublicStore = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    const { supplierEmail } = useParams();
    const [supplier, setSupplier] = useState(null); 
    const [products, setMyProducts] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8080/shop/get-supplier/id/${supplierEmail}`, { headers })
        .then((response) => {
            console.log(response.data)
            setSupplier(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
            axios.get(`http://localhost:8080/shop/all-products/supplier/id/${supplierEmail}`, { headers })
            .then((response) => {
              console.log(response.data)
              setMyProducts(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        
      }, []);

      const productTypes = [
        "ELECTRONIC",
        "FOOD",
        "HARDWARE",
        "FASHION",
        "VEHICLE",
        "SKINCARE",
        "SOAP",
        "FURNITURE",
        "TOYS",
        "ACCESSORIES",
        "STATIONERY",
        "MEDIA",
      ];
    
      // Create an object to store products by type
      const productsByType = {};
    
      // Loop through products and organize them by type
      products.forEach((product) => {
        const { productType } = product;
        if (!productsByType[productType]) {
          productsByType[productType] = [];
        }
        productsByType[productType].push(product);
      });

      
    return(
        <>
        <Header activePage={""} />
        {supplier && products && (
            <div className="body">
                <div className="d-flex justify-content-center col-12">
                    <div className="col-3">
                    <div className="col-12">
                    <div className="profileBox1 ">
                        <div className="col-12  my-auto d-flex justify-content-center">
                            <div>
                                            {supplier.companyImage && (
                                            <img src={`data:image/jpeg;base64,${supplier.companyImage}`} alt="" className="col-12 profileDash" />
                                            )}

                                            {!supplier.companyImage && (
                                            <img src={store} alt="" className="col-12 profileDash " />
                                            )}
                            </div>
                        </div>
                    </div>
            <div style={{borderRadius:"0px 0px 20px 20px"}} className=" loginBox bg-white text-center">
                                            <br />
                                            <br />
                                            <br />
                                            {supplier && (
                                            <>
                                            
                                            <p className="display-6 teksoren">{supplier.companyName || "-"}</p>
                                            <hr />
                                            <>
                                            <p className="lead teksprimary"><Icon.GeoAltFill className="mb-1 ms-1" /> {supplier.city || ""}, {supplier.state || ""}, {supplier.country || ""}. <br /> {supplier.postcode || ""}  </p>
                                            <br />
                                            <br />
                                            <br />
                                            </>

                                            </>


                                            )}
            </div>
                </div>
                    </div>
                    <div className="col-9 ms-4 px-3 loginBox">
                            <div className="overflowContent2 px-5">


                                <div className="mb-5">
                                <p className="display-6 teksprimary">Electronics</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "ELECTRONIC" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>



                                <div className="mb-5">
                                <p className="display-6 teksprimary">Foods & Beverages</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "FOOD" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>


                                <div className="mb-5">
                                <p className="display-6 teksprimary">Hardware</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "HARDWARE" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Fashion & trend</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "FASHION" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Automotives</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "VEHICLE" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Skincare</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "SKINCARE" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Body wash</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "SOAP" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Furnitures</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "FURNITURE" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Kids play & Toys</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "TOYS" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Accessories</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "ACCESSORIES" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                                <div className="mb-5">
                                <p className="display-6 teksprimary">Stationery</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "STATIONERY" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>


                                <div className="mb-5">
                                <p className="display-6 teksprimary">Films & Music</p>
                                <div className="overside2 py-4 ">
                                    <div className="d-flex">
                                    {products.map((product) => (
                                                    product.productType === "MEDIA" && (
                                        <div className="me-3" key={product.productId} >
                                        <div className="productBox bg-white mb-4">
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
                                        </div>
                                        </div>
                                    )
                                    ))}
                                    </div>
                                </div>

                                </div>

                               
                                
                            </div>
                            
                    </div>
                </div>
        </div>
        )}
        </>
    )
}