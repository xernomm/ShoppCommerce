import Header from "../../components/user/header";
import { LandingComponent } from "../../components/user/landingComponent";

export function LandingPage(){
    return(
        <>
        <Header activePage={"/"} />
        <LandingComponent />
        </>
    )
}