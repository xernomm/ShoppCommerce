import { AboutUsComp } from "../../components/user/aboutUsComp"
import Header from "../../components/user/header"

export const AboutUs = () => {
    return(
        <>
        <Header activePage={"about-us"} />
        <div className="body">
        <AboutUsComp />
        </div>
        </>
    )
}