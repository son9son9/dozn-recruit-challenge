import { jwtDecode } from "jwt-decode";

// JWT 토큰 복호화
export const decodeData = (data) => {
  if (data) {
    const decoded = jwtDecode(data);
    return decoded;
  }
};

// 토큰 불러와서 decode
const decodedToken = () => {
  // localStorage에서 토큰 불러오기
  const token = localStorage.getItem("dozn-login-token");
  // 토큰이 존재하지 않으면 false 반환
  if (!token) return false;
  return decodeData(token);
};

// 토큰 유효성 검사 로직
export const checkToken = () => {
  const decoded = decodedToken();
  const now = new Date().getTime();
  const remainTime = decoded.exp * 1000 - now;

  // 남은 시간이 1 이상이면 true, 1 미만이면 false
  if (remainTime > 0) return true;
  else return false;
};

// 로그아웃 타이머
export const logoutTimer = (navigate) => {
  const decoded = decodedToken();
  // 토큰이 존재하지 않으면 false 반환
  if (!decoded) return false;
  const now = new Date().getTime();
  const remainTime = parseInt(decoded.exp) * 1000 - parseInt(now);
  //   const remainTime = parseInt(now + 10000) - parseInt(now);

  // 타임아웃 설정
  const timer = setTimeout(() => {
    // 토큰 삭제 후 로그인 페이지로 이동
    localStorage.removeItem("dozn-login-token");
    alert("토큰 유효기간이 만료되었습니다.\n로그인 페이지로 이동합니다.");
    navigate("/login");
  }, remainTime);

  return timer;
};
