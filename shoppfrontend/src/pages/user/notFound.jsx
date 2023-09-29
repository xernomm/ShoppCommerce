import Header from "../../components/user/header";
import notFound from '../../img/notfound.jpg'
export function NotFound(){
    return(
            <>
            <Header activePage={""} />
            <div className="body my-auto mx-auto">
                <div className="d-flex justify-content-center">
                <img src={notFound} alt="" className="col-5 rounded-5 " />

                </div>
        <h1 className="text-center lead mb-5"><span className="fw-bold display-6">Oops.. Sorry</span> <br /> <br /> We can't find for what you're looking for</h1>

        <hr />
        <p className="text-center">
        <a href="/" className="linkprimary lead mx-auto text-center">Return to home</a>

        </p>
        <div style={{paddingBottom:"200px"}}></div>
    </div>
            </>
    )
}