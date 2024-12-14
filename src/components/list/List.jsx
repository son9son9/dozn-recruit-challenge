import { useEffect, useState } from "react";
import styles from "./list.module.scss";
import { checkToken, logoutTimer } from "../../common";
import { Link, useNavigate } from "react-router-dom";

const List = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [pageSize] = useState(10);
  const [pageIdx, setPageIdx] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiList, setApiList] = useState([]);

  const requestApiList = async () => {
    try {
      const response = await fetch(`https://admin.octover.co.kr/admin/api/user/api/list?pageSize=${pageSize}&pageIdx=${pageIdx}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setTotalPage(result.data.totalPage);
      setApiList(result.data.list);
    } catch (error) {
      console.error(error);
    }
  };

  // 호출 버튼 클릭 시 팝업
  const callPopupHandler = () => {
    window.open("/", "팝업", "width = 500, height = 500, top = 100, left = 200, location = no");
  };

  // 페이지 클릭 핸들러
  const pageClickHandler = (page) => {
    setPageIdx(page);
  };

  useEffect(() => {
    // 토큰 유효성 검사
    if (!checkToken()) {
      alert("토큰이 유효하지 않습니다.\n로그인 페이지로 이동합니다.");
      navigate("/login");
    }

    // api 호출을 위해 토큰 불러오기
    setToken(localStorage.getItem("dozn-login-token"));

    // 로그아웃 타이머 생성
    const timer = logoutTimer(navigate);
    // 언마운트 시 타이머 제거
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (token) {
      requestApiList();
    }
  }, [token, pageIdx]);

  return (
    <div className={`${styles.container} render-animation`}>
      <h2>API 목록</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">API 이름</th>
            <th scope="col">API 코드</th>
            <th scope="col">API 설명</th>
            <th scope="col">모듈 코드</th>
            <th scope="col">모듈 이름</th>
            <th scope="col">키워드 코드</th>
            <th scope="col">키워드 이름</th>
            <th scope="col">제공기관</th>
            <th scope="col">스크래핑 데이터</th>
          </tr>
        </thead>
        <tbody>
          {apiList.length < 1 && (
            <tr>
              <td colSpan={9} className={styles.empty}>
                <h4>조회된 데이터가 없습니다.</h4>
              </td>
            </tr>
          )}
          {apiList.map((value, i) => {
            return (
              <tr key={i}>
                <td>{value.apiNm}</td>
                <td>{value.apiCd}</td>
                <td>{value.apiDesc}</td>
                <td>{value.mdulCustCd}</td>
                <td>{value.mdulNm}</td>
                <td>{value.kwrdCd}</td>
                <td>{value.kwrdNm}</td>
                <td>{value.prvr}</td>
                <td>
                  <button onClick={callPopupHandler}>호출</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {/* 총 페이지만큼 숫자 배열 생성하여 각각의 Link로 매핑 */}
        {Array.from({ length: totalPage }, (v, i) => i + 1).map((v, i) => {
          return (
            <Link to="/list" key={i} onClick={() => pageClickHandler(i + 1)}>
              {v}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default List;
