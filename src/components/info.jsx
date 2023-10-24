import About from "./about";
import Footer from "./footer";
import Interests from "./interests";

export default function Info() {
  return (
    <div className="container">
      <div className="card">
        <div className="info">
          <img
            className="dp"
            src="/src/assets/shawon_1.jpg"
            alt="profile pic"
          />
          <h2 className="name">Asif Bhuiyan Shawon</h2>
          <h4 className="prof">Studying in CSE [NSU]</h4>
          <h5 className="web-link">withshawon.wordpress.com</h5>
          <div className="buttons">
            <a href="mailto:asifbhshawon71@gmail.com">
              {" "}
              <button className="email">
                <i className="fa fa-envelope"></i> Email
              </button>
            </a>
            <a
              href="https://www.linkedin.com/in/asif-bhuiyan-shawon/"
              target="_blank"
              rel="noreferrer"
            >
              <button className="linkedin">
                <i className="fa fa-linkedin-square"></i> LinkedIn
              </button>
            </a>
          </div>
        </div>
        <About />
        <Interests />
        <Footer />
      </div>
    </div>
  );
}
