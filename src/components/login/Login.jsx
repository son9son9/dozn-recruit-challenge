import { useState } from "react";
import styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState("");
  const [pwInput, setPwInput] = useState("");

  // 로그인 API 요청
  const requestLogin = async () => {
    try {
      const response = await fetch("https://admin.octover.co.kr/admin/api/recruit/login-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admUserId: idInput, userPw: pwInput }),
      });

      const result = await response.json();
      // localStorage에 token 저장
      localStorage.setItem("dozn-login-token", result.data.accessToken);
      // 리스트 페이지로 이동
      navigate("/list");
    } catch (error) {
      console.error("실패\n", error);
    }
  };

  // 로그인 버튼 로직
  const loginHandler = () => {
    requestLogin();
  };

  // 엔터키 입력 시 로그인 로직 동작
  const keyPressHandler = (e) => {
    if (e.keyCode === 13) {
      loginHandler();
    }
  };

  return (
    <div className={`${styles.container} render-animation`}>
      <div className={styles["login-box"]}>
        <h2>로그인</h2>
        <input type="text" onChange={(e) => setIdInput(e.currentTarget.value)} onKeyDown={keyPressHandler} placeholder="ID"></input>
        <input type="password" onChange={(e) => setPwInput(e.currentTarget.value)} onKeyDown={keyPressHandler} placeholder="PASSWORD"></input>
        <button className={styles.signin} onClick={loginHandler}>
          로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
