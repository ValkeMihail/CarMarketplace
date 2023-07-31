import { Link } from "react-router-dom";

const Trial = () => {
  return (
    <section id="trial" className="trial">
      <h2>Are you a dealer?</h2>
      <p>
        Get a free account to start using these functionalities:
        <br />
        Tools and services available to sellers and buyers, You have your own
        website inside the CarMarketplace platform where customers can see all
        your ads.
      </p>
      <Link className="btn btn-primary" to="/login">
        Join Us Now
      </Link>
    </section>
  );
};

export default Trial;
