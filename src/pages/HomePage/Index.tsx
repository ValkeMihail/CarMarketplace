import Explore from "../../containers/homePageContainers/Explore";
import { HeaderHome } from "../../containers/homePageContainers/HeaderHome";
import Services from "../../containers/homePageContainers/Services";
import Trial from "../../containers/homePageContainers/Trial";



export const Home = () => {
    return (
        <>
            <HeaderHome/>
            <Services/>
            <Explore/>
            <Trial/>

        </>
    );
}