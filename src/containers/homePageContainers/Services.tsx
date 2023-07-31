import bottom from "../../assets/bottom.png";
import buyPng from "../../assets/buy.png";
import sellPng from "../../assets/sell.png";

import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img
        id="services"
        width={1136}
        height={299.35}
        alt="Services section staring image"
        src={bottom}
        className="grid-img"
      />
      <section className="services">
        <div className="heading">
          <h2>What we actually do</h2>
          <p>
            As a consumer-to-consumer marketplace website, our platform provides
            a space for individuals to buy and sell goods and services directly
            to each other. Our website offers a user-friendly interface for
            listing and browsing items, as well as tools for communication
            between buyers and sellers.
          </p>
        </div>
        <div className="servicesCards cards">
          <div onClick={() => navigate("/buy")} className="card">
            <div className="light"></div>

            <img src={buyPng} alt="buying-icon" />
            <h3>Buy a new Car</h3>
          </div>
          <div className="card" onClick={() => navigate("/sell")}>
            <div className="light"></div>
            <img src={sellPng} alt="selling-icon" />
            <h3>Sell your Car</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
