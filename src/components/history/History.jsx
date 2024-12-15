import { useEffect, useState } from "react";
import styles from "./History.module.scss";
import { checkToken, dateFormatter, logoutTimer, requestScrapingData, sorter } from "../../common";
import { Link, useNavigate } from "react-router-dom";
import Pin from "../../assets/pin.svg";
import Pinned from "../../assets/pinned.svg";

const History = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  // 정렬 방식 : true = 최신 순, false = 오래된 순
  const [sortType, setSortType] = useState(true);
  const [dataList, setDataList] = useState(JSON.parse(localStorage.getItem("dozn-scraping-data-history")));
  const [pinnedList, setPinnedList] = useState(JSON.parse(localStorage.getItem("dozn-scraping-data-history-pinned")));

  // 카드 클릭 핸들러
  const cardClickHandler = (value) => {
    requestScrapingData(value, token, "history");
  };

  // 정렬 버튼 클릭 핸들러
  const sortClickHandler = () => {
    setSortType(!sortType);
  };

  // 북마크 클릭 핸들러
  const pinClickHandler = (e, value) => {
    e.stopPropagation();

    const checkPinnedList = pinnedList.filter((data) => JSON.stringify(data) === JSON.stringify(value));

    // 기존 북마크에 존재하는지 확인
    if (checkPinnedList.length > 0) {
      // 이미 북마크에 존재 시
      // pinnedList에서 제거 및 dataList에 추가
      setPinnedList(pinnedList.filter((data) => JSON.stringify(data) !== JSON.stringify(value)));
      setDataList(dataList ? [...dataList, value] : [value]);
    } else {
      // 북마크에 존재하지 않을 시 새로 북마크에 등록
      // pinnedList에 항목 추가 및 dataList에서 제거
      setPinnedList(pinnedList ? [...pinnedList, value] : [value]);
      setDataList([...dataList].filter((data) => JSON.stringify(data) !== JSON.stringify(value)));
    }
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

  // 정렬 모드 변경 시 dataList에 정렬된 데이터 삽입
  useEffect(() => {
    setDataList(sorter(dataList, sortType));
  }, [sortType]);

  // pinnedList 상태 변경 시 localStorage에 반영
  useEffect(() => {
    if (pinnedList) {
      localStorage.setItem("dozn-scraping-data-history-pinned", JSON.stringify(pinnedList));
    }
  }, [pinnedList]);

  // dataList 상태 변경 시 localStorage에 반영
  useEffect(() => {
    if (dataList) {
      localStorage.setItem("dozn-scraping-data-history", JSON.stringify(dataList));
    }
  }, [dataList]);

  if (!dataList) {
    return (
      <div className={`${styles.container} render-animation`}>
        <Link to="/list" className={styles["top-nav"]}>
          API 목록
        </Link>
        <h3>조회할 데이터가 없습니다.</h3>
      </div>
    );
  }
  return (
    <div className={`${styles.container} render-animation`}>
      <Link to="/list" className={styles["top-nav"]}>
        API 목록
      </Link>
      <h2>API 조회 내역</h2>
      <div className={styles["sort-box"]}>
        <div>정렬 순서</div>
        <button onClick={sortClickHandler} className={styles["sort-button"]}>
          {sortType ? "최신 순" : "오래된 순"}
        </button>
      </div>
      <div className={styles["card-box"]}>
        {/* 북마크 된 배열, 기존 배열 순서로 표시 (기존 배열은 sortType에 따라 정렬되어 보여짐) */}
        {[...pinnedList, ...sorter(dataList, sortType)].map((value, i) => {
          return (
            <div className={styles.card} key={i} onClick={() => cardClickHandler(value.apiInfo)}>
              <img src={pinnedList ? (pinnedList.length > i ? Pinned : Pin) : Pin} className={styles.pin} onClick={(e) => pinClickHandler(e, value)} />
              <div>
                <span className={styles.name}>API 이름 : </span>
                {value.apiInfo.apiNm}
              </div>
              <div>
                <span className={styles.name}>API 코드 : </span>
                {value.apiInfo.apiCd}
              </div>
              <div>
                <span className={styles.name}>모듈 이름 : </span>
                {value.apiInfo.mdulNm}
              </div>
              <div>
                <span className={styles.name}>모듈 코드 : </span>
                {value.apiInfo.mdulCustCd}
              </div>
              <div>
                <span className={styles.name}>호출 시간 : </span>
                {dateFormatter(value.apiInfo.callTime)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
