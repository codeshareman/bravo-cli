
import CreateAPI from "./config"
import ScanPlayService from "../client/service/ScanPlayService";

//扫码看
const ScanPlay = new ScanPlayService(CreateAPI('wws-scan-play'));

export default {
  ScanPlay
};
