const STATE = {
  total_detail: 0,
  profitDetail: [],
  profitSummary: null,
  downloadUrl: "",
  bannerConten: {},
  currentPage: 1
};

export default function(state = STATE, action) {
  switch (action.type) {
    case "SET_PROFIT_DETAIL":
      return {
        ...state,
        profitDetail: action.data
      };
    case "SET_PROFIT_SUMMARY":
      return {
        ...state,
        profitSummary: action.data
      };
    case "SET_DETAIL_TOTAL": return {
        ...state,
        total_detail: action.data
    }
    case "SET_DOWNLOAD_URL":
      return {
        ...state,
        downloadUrl: action.data
      };
    case "SET_BANNER_CONTEN":
      return {
        ...state,
        bannerConten: action.data
      }
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.page
      }
    default:
      return { ...state };
  }
}
