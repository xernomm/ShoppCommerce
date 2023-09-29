
function Footer() {
    return (
      <footer>
  
        <div
          style={{ padding: "60px" }}
          className="col-12 bg-dark text-white"
        >
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12 px-5">
              <div className="d-flex">
                <h5 className="lead fw-bold  mb-3">Shopp.</h5>
              </div>
              <small className="">
                Jl. Soekarno Hatta No.378, Kb. Lega, Kec. Bojongloa Kidul, Kota
                Bandung, Jawa Barat 40235
              </small>
            </div>
  
            <div className="col-lg-5 col-md-6 col-sm-12 px-5">
              <h1 className="lead fw-bold mb-3">Shopp.</h1>
              <small className="">
                <span className="fw-bold">Shopp. </span> we connect talent with opportunities. Our platform bridges the gap between skilled professionals and rewarding careers. Empowering dreams, we're dedicated to shaping futures by matching aspirations with the perfect job.
              </small>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <h1 className="lead fw-bold">Sitemap</h1>
              <ul className="mt-3 px-1">
                <div className="d-flex">
                  <div className="col-6">
                    <li className="mb-1">
                      <a href="/">Home</a>
                    </li>
                    <li className="mb-1">
                      <a href="/about-us">About us</a>
                    </li>
                    <li className="mb-1">
                      <a href="/contact-us">Contact us</a>
                    </li>
                    <li className="mb-1">
                      <a href="/about-us">Where to find us</a>
                    </li>
                  </div>
                  <div className="col-6">
                    <li className="mb-1">
                      <a href="/terms">Terms & Conditions</a>
                    </li>
                    <li className="mb-1">
                      <a href="/privacy">Privacy Policy</a>
                    </li>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
  
        <div
          style={{ backgroundColor: "black", padding: "20px" }}
          className="col-12"
        >
          <div className="text-center lead text-white">
            &copy; {new Date().getFullYear()}{" "}
            <strong>
              <span>Shopp</span>
            </strong>
            . All Rights Reserved
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  