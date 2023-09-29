import axios from "axios"
import React, {useState, useEffect} from "react"
import * as Icon from "react-bootstrap-icons"
export const AllProductsElectronic = () => {
    const [products, setProducts] = useState([]);

    const sessionUser = JSON.parse(sessionStorage.getItem('loginFormData'));
    const token = sessionUser.token;

    const headers = {
        Authorization: `Bearer ${token}`,
      };

      useEffect(() => {
        axios.get("http://localhost:8080/shop/all-products", { headers })
          .then((response) => {
            console.log(response.data)
            setProducts(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

    return(
        <div className="d-flex overside p-5">
        {products.map((product) => (
            product.productType === "ELECTRONIC" && (
            <div key={product.productId}>
            <div className="productBox mx-3">
                <img  src={`data:image/jpeg;base64,${product.productImage}`} alt="" className="col-12 rounded-5 productImg" />
              <p className="lead mt-3">{product.productName}</p>
              <p className="display-6 mt-3">${product.price}</p>
              <p className="text-muted">{product.stock}</p>
            </div>
          </div>
            )
        ))}
      </div>
    )
}