import { RESTDataSource } from "apollo-datasource-rest"
import { parseString, processors } from "xml2js"
import axios from "axios"

const baseURL = "http://openapi.its.ulsan.kr/UlsanAPI/"
const KEY =
  "?ServiceKey=bl8rMsNR%2FFJz%2FCoQAMg9FH1bYNQ4E8TvYDLexwZN2W3%2FHvck1vtDe%2BYHdfxkDMjcGTY%2BfHH8I6pyOM8san7nug%3D%3D"
const DEFAULTINPUT = "&pageNo=1&numOfRows=10"
const XMLOptions = {
  explicitArray: false,
  valueProcessors: [
    (value, name) => {
      value = processors.parseNumbers(value)
      return value
    },
  ],
}

// init RouteInfo
let RouteInfo = []
axios
  .get(baseURL + "RouteInfo.xo" + KEY + DEFAULTINPUT)
  .then((response) => {
    parseString(response.data, XMLOptions, (err, result) => {
      RouteInfo = result.tableInfo.list.row
    })
    console.log("RouteInfo Init Complete")
  })
  .catch((res) => console.log(`RouteInfo Init ${res}`))

// class definition
class BusAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "http://openapi.its.ulsan.kr/UlsanAPI/"
  }

  async getRoute() {
    return RouteInfo
  }
}

export default BusAPI
