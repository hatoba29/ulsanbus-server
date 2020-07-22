import { RESTDataSource } from "apollo-datasource-rest"

class BusAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "http://openapi.its.ulsan.kr/UlsanAPI/"
  }
}

export default BusAPI
