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
  console.log("로그아웃까지 남은 시간 :", remainTime);

  // 타임아웃 설정
  const timer = setTimeout(() => {
    // 토큰 삭제 후 로그인 페이지로 이동
    localStorage.removeItem("dozn-login-token");
    alert("토큰 유효기간이 만료되었습니다.\n로그인 페이지로 이동합니다.");
    navigate("/login");
  }, remainTime);

  return timer;
};

// 스크래핑 데이터 요청
export const requestScrapingData = async (apiParams, token, caller) => {
  try {
    // localStorage 내 스크래핑 데이터 초기화
    localStorage.removeItem("dozn-scraping-data");

    const response = await fetch(`https://admin.octover.co.kr/admin/api/recruit/scrp-recruit?mdulCustCd=${apiParams.mdulCustCd}&apiCd=${apiParams.apiCd}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    const coreData = { ...result.data.out.data };

    // 팝업 데이터 저장
    localStorage.setItem("dozn-scraping-data", JSON.stringify(coreData));

    // 조회 내역에서 호출 시 localStorage 등록 과정 생략
    if (caller !== "history") {
      // 스크래핑 데이터 내역에 추가
      const now = new Date().getTime();
      const history = localStorage.getItem("dozn-scraping-data-history");
      const parsedHistory = history ? JSON.parse(history) : "";
      if (parsedHistory) {
        // history 페이지에 필요한 정보 삽입
        localStorage.setItem(
          "dozn-scraping-data-history",
          JSON.stringify([
            ...parsedHistory,
            {
              ...coreData,
              apiInfo: {
                apiNm: apiParams.apiNm,
                apiCd: apiParams.apiCd,
                mdulNm: apiParams.mdulNm,
                mdulCustCd: apiParams.mdulCustCd,
                callTime: now,
              },
            },
          ])
        );
      } else {
        localStorage.setItem(
          "dozn-scraping-data-history",
          JSON.stringify([
            {
              ...coreData,
              apiInfo: {
                apiNm: apiParams.apiNm,
                apiCd: apiParams.apiCd,
                mdulNm: apiParams.mdulNm,
                mdulCustCd: apiParams.mdulCustCd,
                callTime: now,
              },
            },
          ])
        );
      }
    }
    // 팝업 오픈
    window.open("/popup", "팝업", "width = 800, height = 600, toolbar=no, scrollbars=no, resizable=yes, location = no");
  } catch (error) {
    console.error(error);
    alert("데이터를 불러오는 데 실패했습니다.");
  }
};

// 정렬 로직
export const sorter = (arr, sortType) => {
  if (arr.length < 1) return [];
  // sortType에 따라 최신 순, 오래된 순으로 정렬
  if (sortType) {
    const orderByNew = [...arr].sort((a, b) => {
      const aTime = parseInt(a.apiInfo.callTime);
      const bTime = parseInt(b.apiInfo.callTime);
      if (aTime < bTime) {
        return 1;
      } else if (aTime > bTime) {
        return -1;
      } else return 0;
    });
    return orderByNew;
  } else {
    const orderByOld = [...arr].sort((a, b) => {
      const aTime = parseInt(a.apiInfo.callTime);
      const bTime = parseInt(b.apiInfo.callTime);
      if (aTime > bTime) {
        return 1;
      } else if (aTime < bTime) {
        return -1;
      } else return 0;
    });
    return orderByOld;
  }
};

// 시간 변환 함수 (YYYY-MM-DD HH:mm)
export const dateFormatter = (time) => {
  if (!time) return false;
  const converter = (n) => {
    return n >= 10 ? n : `0${n}`;
  };
  const dateInstance = new Date(time);
  const year = dateInstance.getFullYear();
  const month = converter(dateInstance.getMonth() + 1);
  const date = converter(dateInstance.getDate());
  const hours = converter(dateInstance.getHours());
  const minutes = converter(dateInstance.getMinutes());
  const seconds = converter(dateInstance.getSeconds());

  const converted = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  return converted;
};
