import { useEffect } from "react";
import styles from "./list.module.scss";
import { checkToken, logoutTimer } from "../../common";
import { useNavigate } from "react-router-dom";

const List = () => {
  const navigate = useNavigate();

  // 토큰 유효성 검사
  useEffect(() => {
    if (!checkToken()) {
      alert("토큰이 유효하지 않습니다.\n로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, []);

  // 로그아웃 타이머
  useEffect(() => {
    // 타이머 생성
    const timer = logoutTimer(navigate);
    // 언마운트 시 타이머 제거
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`${styles.container} render-animation`}>
      <h2>리스트 페이지</h2>
    </div>
  );
};

export default List;
