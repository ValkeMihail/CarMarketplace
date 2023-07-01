import { useNavigate } from "react-router-dom";


export const HeaderHome = () => {
    
    const navigate = useNavigate();

    return (
        <header>
            <div className="container">
                <div className="header-body">
                    <div>
                        <div>
                            <p>Buy a new or used car from dealers or normal users</p>
                            <span className="bar"></span>
                            <h1><a 
                                    href="/buy"
                                    onClick={() => navigate('/buy')}
                                    className="heading" 
                                    >
                                        Buy Cars
                                </a>
                            </h1>
                        </div>
                        <div>
                            <h1>
                                <a className="heading" 
                                    href="/sell"
                                    onClick={() => navigate('/sell')}    
                                >Sell Cars</a>
                            </h1>
                            <span className="bar"></span>
                            <p>Fill in the details of the car and list it for free</p>
                        </div>
                        <div className="btn-group">
                            <a href="#trial" className="btn btn-primary">Join Us</a>
                            <a href="#services" className="btn btn-secondary">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
