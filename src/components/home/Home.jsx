import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const buttonClickHandler = () => {
    navigate("/login");
  };

  return (
    <div className="render-animation">
      <h3>Root 페이지 입니다.</h3>
      <button onClick={buttonClickHandler}>로그인 페이지로 이동</button>
    </div>
  );
};

export default Home;
