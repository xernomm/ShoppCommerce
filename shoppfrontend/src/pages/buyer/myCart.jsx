import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CartComponent } from "../../components/buyer/cartComponent";
import { CheckOutBtn } from "../../components/buyer/checkout";
import Header from "../../components/user/header";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { NotFound } from "../user/notFound";

export function MyCart() {
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [carts, setCarts] = useState(null); // Initialize carts as null

  useEffect(() => {
    const user = sessionStorage.getItem("loginFormData");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
      setUserName(parsedUser.userDetails.name);
    }
  }, []);

  const sessionUser = JSON.parse(sessionStorage.getItem("loginFormData"));
  const token = sessionUser.token;

  const headers = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/shop/get-buyer/${sessionUser.email}`, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        setBuyer(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Check if 'buyer' is not null before making the second API call
    if (buyer !== null) {
      axios
        .get(`http://localhost:8080/shop/cart/${buyer.cart.cartId}`, {
          headers,
        })
        .then((response) => {
          console.log(response.data);
          setCarts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [buyer]);

  const handleClearItems = () => {
    axios
      .delete(`http://localhost:8080/shop/clear-items/${buyer.cart.cartId}`, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        setCarts([]); // Set carts to an empty array when cleared
        Swal.fire({
          icon: "success",
          title: "Cart is now empty!",
          footer: "",
          confirmButtonColor: "#127d3f",
          confirmButtonText: "Ok",
          preConfirm: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Header activePage={""} />
      {sessionUser.role === "BUYER" && (
        <div className="body bg-light">
          <p className="display-6 ms-5 teksoren">
            My cart <Icon.Cart3 className="mb-1" />
          </p>

          <div className="d-flex justify-content-center">
            <div className="col-7 mx-auto px-5">
              {carts && carts.length > 0 ? (
                <div>
                  <div className="overflowContent px-4">
                    <CartComponent />
                  </div>
                  <Button
                    onClick={handleClearItems}
                    variant=""
                    className="btn-danger col-6 mb-2 mt-5"
                  >
                    Clear Cart
                  </Button>
                </div>
              ) : (
                <div className="loginBox">
                  {buyer && (
                    <div
                      style={{ paddingTop: "12%", paddingBottom: "30%" }}
                      className="px-5 "
                    >
                      <p className="lead text-center">
                        <span className="teksprimary">Hi {buyer.name}</span>,
                        your cart is empty, please add some items to order.
                      </p>
                      <div className="d-flex justify-content-center">
                        <Button
                          href="/dashboard"
                          variant=""
                          className="btnOren col-6 mb-2 mt-3 mx-auto"
                        >
                          Add Items <Icon.PlusCircle className="mb-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-5 px-5">
              <CheckOutBtn />
            </div>
          </div>
        </div>
      )}

      {sessionUser.role !== "BUYER" && <NotFound />}
    </>
  );
}
