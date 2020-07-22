import { RESTDataSource } from "apollo-datasource-rest"
import config from "./config"
import { parseString } from "xml2js"

class BusAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "http://openapi.its.ulsan.kr/UlsanAPI/"
  }

  // convert xml to object
  convert(response) {
    let res = []
    parseString(response, config.xmlOptions, (err, result) => {
      res = result.tableInfo.list.row
    })
    return res
  }

  async getRouteDetail(args: { id: number }) {
    return this.get(
      "AllRouteDetailInfo.xo" + config.defaultInput + "&Routeid=" + args.id
    ).then(this.convert)
  }

  async getArrival(args: { id: number }) {
    return this.get(
      "getBusArrivalInfo.xo" + config.defaultInput + "&stopid=" + args.id
    ).then(this.convert)
  }

  async getTimetable(args: { id: number; day: number }) {
    return this.get(
      "BusTimetable.xo" +
        config.defaultInput +
        "&routeNo=" +
        args.id +
        "&dayOfWeek=" +
        args.day
    ).then(this.convert)
  }
}

export default BusAPI
