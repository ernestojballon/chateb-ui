import "./welcome.css";

const Welcome = () => {
  return (
    <div className="welcome">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <div>
            <h1>Chateb</h1>
            <blockquote>by Ernesto Ballon</blockquote>
          </div>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Any Question</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Personal translator</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Code assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
