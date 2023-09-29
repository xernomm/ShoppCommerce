import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import LogoutButton from "./logoutButton";
import axios from "axios";
import profileImg from "../../img/profile.jpg";
import { OffCanvas } from "./offcanvas";

const Header = ({ activePage }) => {
  const user = sessionStorage.getItem("loginFormData");
  const parsedUser = JSON.parse(user);

  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("loginFormData");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email);
      setUserName(parsedUser.name);
    }
  }, []);

  const [show, setShow] = useState(false);

  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const handleCloseOffCanvas = () => {
    console.log("Closing OffCanvas");
    setShowOffCanvas(false);
  };

  return (
    <>
      <header className="fixed-top">
        <Navbar
          className="navbar-custom "
          collapseOnSelect
          expand="lg"
          variant="light"
        >
          <Container className="col-12 d-flex justify-content-center" fluid>
            {userEmail && (
              <OffCanvas
                show={show} // Match the prop name in the OffCanvas component
                onHide={handleCloseOffCanvas}
              />
            )}

            <Navbar.Brand className="col-2" href="/">
              <div className="d-flex justify-content-center">
                <p className="display-6 text-white fw-bold my-auto">
                  Shopp. <Icon.ShopWindow className="mb-2 teksprimary" />
                </p>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="" />
            <Navbar.Collapse id="responsive-navbar-nav" className="">
              {!userEmail && (
                <Nav className="col-10 d-flex mx-auto justify-content-center user ">
                  <Icon.House className="my-auto ms-3" />
                  <NavLink
                    exact
                    to="/"
                    className={`nav-link ${
                      activePage === "home" ? "active" : ""
                    }`}
                  >
                    Home
                  </NavLink>

                  <Icon.Person className="my-auto ms-3" />
                  <NavLink
                    to="/getStarted"
                    className={`nav-link ${
                      activePage === "getStarted" ? "active" : ""
                    } `}
                  >
                    Get Started
                  </NavLink>

                  <Icon.ShopWindow className="my-auto ms-3" />
                  <NavLink
                    to="/about-us"
                    className={`nav-link ${
                      activePage === "about-us" ? "active" : ""
                    }`}
                  >
                    About Us
                  </NavLink>

                  <Icon.Telephone className="my-auto ms-3" />
                  <NavLink
                    to="/contact-us"
                    className={`nav-link ${
                      activePage === "contact-us" ? "active" : ""
                    }`}
                  >
                    Contact Us
                  </NavLink>
                </Nav>
              )}
              {userEmail && parsedUser.role === "BUYER" && (
                <Nav className="col-12 d-flex mx-auto justify-content-center user ">
                  <NavLink
                    exact
                    to="/dashboard"
                    className={` nav-link ${
                      activePage === "home" ? "active" : ""
                    }`}
                  >
                    <Icon.ShopWindow className="mb-1" /> Market
                  </NavLink>

                  <NavLink
                    to="/contact-us"
                    className={`nav-link ${
                      activePage === "contact-us" ? "active" : ""
                    } `}
                  >
                    <Icon.Telephone className="mb-1" /> Contact Us
                  </NavLink>

                  <NavLink
                    to="/myCart"
                    className={`nav-link ${
                      activePage === "myCart" ? "active" : ""
                    } `}
                  >
                    <Icon.Cart className="mb-1" /> My Cart
                  </NavLink>

                  <NavLink
                    to="/myOrders"
                    className={`nav-link ${
                      activePage === "myCart" ? "active" : ""
                    } `}
                  >
                    <Icon.BagHeartFill className="mb-1" /> My Orders
                  </NavLink>

                  {userEmail && (
                    <>
                      <Icon.Person className="my-auto ms-2" />
                      <LogoutButton />
                    </>
                  )}
                </Nav>
              )}
              {userEmail && parsedUser.role === "SUPPLIER" && (
                <Nav className="col-12 d-flex mx-auto justify-content-center user ">
                  <NavLink
                    to="/myProducts"
                    className={`nav-link ${
                      activePage === "myProducts" ? "active" : ""
                    } `}
                  >
                    <Icon.Cart className="mb-1" /> My Products
                  </NavLink>

                  <NavLink
                    to="/newProduct"
                    className={`nav-link ${
                      activePage === "newProduct" ? "active" : ""
                    } `}
                  >
                    <Icon.BagPlus className="mb-1" /> Add Product
                  </NavLink>

                  <NavLink
                    to="/contact-us"
                    className={`nav-link ${
                      activePage === "contact-us" ? "active" : ""
                    } `}
                  >
                    <Icon.Telephone className="mb-1" /> Contact Us
                  </NavLink>

                  {userEmail && (
                    <>
                      <Icon.Person className="my-auto ms-2" />
                      <LogoutButton />
                    </>
                  )}
                </Nav>
              )}

              {userEmail && parsedUser.role === "ADMIN" && (
                <Nav className="col-12 d-flex mx-auto justify-content-center user ">
                  <NavLink
                    to="/dashboard"
                    className={`nav-link ${
                      activePage === "dashboard" ? "active" : ""
                    } `}
                  >
                    <Icon.House className="mb-1" /> Dashboard
                  </NavLink>

                  <NavLink
                    to="/manageUsers"
                    className={`nav-link ${
                      activePage === "contact-us" ? "active" : ""
                    } `}
                  >
                    <Icon.People className="mb-1" /> Manage Users
                  </NavLink>

                  <NavLink
                    to="/manageProducts"
                    className={`nav-link ${
                      activePage === "myCart" ? "active" : ""
                    } `}
                  >
                    <Icon.Bag className="mb-1" /> Manage Products
                  </NavLink>

                  <NavLink
                    to="/manageOrders"
                    className={`nav-link ${
                      activePage === "myCart" ? "active" : ""
                    } `}
                  >
                    <Icon.BagCheck className="mb-1" /> Manage Orders
                  </NavLink>

                  <NavLink
                    to="/sendVouchers"
                    className={`nav-link ${
                      activePage === "myCart" ? "active" : ""
                    } `}
                  >
                    <Icon.Cash className="mb-1" /> Send Vouchers
                  </NavLink>

                  <NavLink
                    to="/allReports"
                    className={`nav-link ${
                      activePage === "myCart" ? "active" : ""
                    } `}
                  >
                    <Icon.InfoCircle className="mb-1" /> Reports
                  </NavLink>

                  {userEmail && (
                    <>
                      <Icon.Person className="my-auto ms-2" />
                      <LogoutButton />
                    </>
                  )}
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
