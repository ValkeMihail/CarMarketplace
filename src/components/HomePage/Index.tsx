import { HeaderHome } from "./HeaderHome";
import { lazy } from "react";

const Services = lazy(() => import('./Services'));
const Explore = lazy(() => import('./Explore'));
const Trial = lazy(() => import('./Trial'));



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