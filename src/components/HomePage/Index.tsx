

import { Explore } from "./Explore";
import { HeaderHome } from "./HeaderHome";
import { Services } from "./Services";
import { Trial } from "./Trial";

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