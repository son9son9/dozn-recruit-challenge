export interface ApiResult {
  admUserId: string;
  apiNm: string;
  apiDesc: string;
  apiCd: string;
  cmnCdLginType: string;
  cmnCdLginTypeNm: string;
  mdulCustCd: string;
  mdulNm: string;
  kwrdCd: string;
  kwrdNm: string;
  prvr: string;
  apiCdUid: string;
  apiLogStus: number | string;
  userApiStus: string;
  changeAble: string;
}

export interface HistoryData {
  scrapedData: Object;
  apiInfo: {
    apiNm: string;
    apiCd: string;
    mdulNm: string;
    mdulCustCd: string;
    callTime: number;
  };
}
