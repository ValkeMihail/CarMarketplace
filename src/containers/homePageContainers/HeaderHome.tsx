import { Link } from "react-router-dom";

export const HeaderHome = () => {
  return (
    <header>
      <div className="container">
        <div className="header-body">
          <div>
            <div>
              <p>Buy a new or used car from dealers or normal users</p>
              <span className="bar"></span>
              <h1>
                <Link to="/buy" className="heading">
                  Buy Cars
                </Link>
              </h1>
            </div>
            <div>
              <h1>
                <Link className="heading" to="/sell">
                  Sell Cars
                </Link>
              </h1>
              <span className="bar"></span>
              <p>Fill in the details of the car and list it for free</p>
            </div>
            <div className="btn-group">
              <a href="#trial" className="btn btn-primary">
                Join Us
              </a>
              <a href="#services" className="btn btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
