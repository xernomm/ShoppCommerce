import richie from "../../img/richie.png"

export const AboutUsComp = () => {
    return(
        <>
        <div className="col-12 d-flex justify-content-center  mb-4">
            <div className="col-5 my-auto px-5">
                <p style={{fontSize:"80px"}} className="display-5">
                    What is <br /><span style={{fontSize:"120px"}} className="display-1 teksoren">Shopp?</span>
                </p>
            </div>
            <div className="col-5 px-5">
                <p className="lead">
                    <span className="fw-bold">
                    <span className="teksoren">Shopp.</span> - Your Destination for Innovative Shopping Solutions!
                    </span>
                <br /><br />
                For years, Jumpstart has been your go-to destination for top-notch products. But when the pandemic hit, we knew it was time for a change. Enter Digital Transformation (DX). We've overhauled our e-commerce platform to meet your evolving needs. Say goodbye to old-school methods and hello to a flawless online shopping experience. Our mission is simple: to provide you with a seamless, error-free, and innovative way to shop. Welcome to the future of retail at Jumpstart!
                </p>
            </div>
        </div>
        <br />
        <hr />
        <br />
        <div className="col-12 d-flex justify-content-center">
            <div className="col-5  d-flex justify-content-center">
                <img src={richie} alt="" className="col-9 rounded-5" />
            </div>
            <div className="col-5 px-5">
                <p className="display-1 teksprimary ">Developer</p>
                <p className="lead">
                Rafael Richie, a 19-year-old Lithan Academy student, is the sole developer behind Jumpstart's digital transformation. With a relentless drive for innovation, he's reshaping the retail landscape single-handedly.
                </p>
            </div>
        </div>
        </>
    )
}