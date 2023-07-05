import { useNavigate } from "react-router-dom";

 const Trial = () => {

    const navigate = useNavigate();

    return (
        <section id="trial" className="trial">
            <h2>Are you a dealer?</h2>
            <p>
                Get a free account to start using these functionalities:<br />
                Tools and services available to sellers and buyers, You have your own website inside the CarMarketplace platform where customers can see all your ads.
            </p>
            <a className="btn btn-primary"
                href="/login"
                 onClick={() => navigate('/login')}
                >Join Us Now</a>
        </section>
    );

}

export default Trial;