
export function showToolTip(message: string , color : string) {

    let tooltip = document.createElement("div");
    tooltip.textContent = message;
    tooltip.style.position = "fixed";
    tooltip.style.bottom = "10px";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translateX(-50%)";
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = color;
    tooltip.style.padding = "10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "9999";
    document.body.appendChild(tooltip);
    setTimeout(function() {
        document.body.removeChild(tooltip);
    }, 3000);
};
    

export const Footer = () => {
    return (
        <div className="container">
            <footer>
                <div>
                    <h2>Online Marketplace</h2>
                    <p>
                        Car marketplace is a platform that has grown a lot in recent years<br className="responsive" />
                        with new users and dealers joining every day. 60% of dealers <br className="responsive" />
                        use CarMarketplace to sell their cars.
                    </p>
                    <hr />
                    
                </div>
                <div>
                    <h3>Quick Links</h3>
                    <ul>
                    

                    
                        
                        <li> Automobiles</li>
                        <li> Career</li>
                        <li> Blog</li>
                        <li> Dealer Premium</li>
                        <li> Documents</li>
                        <li> Terms</li>
                    </ul>
                </div>
                <div>
                    <h3>Company</h3>
                    <ul>
                        <li> Marketplace</li>
                        <li> Privacy Policy</li>
                        <li> Conditions</li>
                        <li> Cookies Policy</li>
                        <li> Cookie Settings</li>
                        <li> Regulations</li>
                    </ul>
                </div>
                <div>
                    <h3>Social Media</h3>
                    <ul>
                        <li><a href="https://www.facebook.com/" target="_blank">Facebook</a></li>
                        <li><a href="https://www.linkedin.com/" target="_blank">Linkedin</a></li>
                        <li><a href="https://twitter.com/" target="_blank">Twitter</a></li>
                        <li><a href="https://web.whatsapp.com/" target="_blank">WhatsUp</a></li>
                        <li><a href="https://web.telegram.org/" target="_blank">Telegram</a></li>
                        <li><a href="https://www.instagram.com/" target="_blank">Instagram</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    )
    
}
                                        