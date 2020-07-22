import { ApolloServer, gql } from "apollo-server"
import { parseString } from "xml2js"
import axios from "axios"
import BusAPI from "./data_source"
import config from "./config"

// init RouteInfo, BusStopInfo
let RouteInfo = []
let BusStopInfo = []
let count = 0
const cancel = axios.CancelToken.source()

axios.defaults.cancelToken = cancel.token
axios.interceptors.response.use(null, (err) => {
  if (count < 2) {
    count++
    console.log(`retry... (${count})`)
    return new Promise((res) => res(init()))
  }
  console.error(`retry failed... (${count})`)
  return Promise.reject(err)
})

async function init() {
  await axios
    .get(config.baseURL + "RouteInfo.xo" + config.defaultInput)
    .then((response) => {
      parseString(response.data, config.xmlOptions, (err, result) => {
        RouteInfo = result.tableInfo.list.row
      })
      console.log("RouteInfo init complete")
    })
    .catch((err) => {
      console.error(`RouteInfo Init ${err}`)
      throw err
    })

  await axios
    .get(config.baseURL + "BusStopInfo.xo" + config.defaultInput)
    .then((response) => {
      parseString(response.data, config.xmlOptions, (err, result) => {
        BusStopInfo = result.tableInfo.list.row
      })
      console.log("BusStopInfo init complete")
    })
    .catch((res) => {
      console.error(`BusStopInfo Init ${res}`)
      throw res
    })
}

/**********************/
/* GraphQL definition */
/**********************/
const typeDefs = gql`
  type Route {
    DIRECTION: Int
    COMPANY: String
    BRTNAME: String
    BRTTYPE: Int
    CLASS: Int
    STOPEDID: Int
    BRTNO: Int
    STOPSTID: Int
    BRTID: Int
  }

  type BusStop {
    RNUM: Int
    STOPREMARK: String
    STOPID: Int
    STOPLIMOUSINE: Int
    STOPNAME: String
  }

  type RouteDetail {
    BRSSEQNO: Int
    STOPID: Int
    STOPNM: String
  }

  type Arrival {
    PREVSTOPCNT: Int
    ARRIVALTIME: Int
    STOPID: Int
    STOPNM: String
    PRESENTSTOPNM: String
    ROUTENM: String
  }

  type Timetable {
    DIRECTION: Int
    TIME: String
    CLASS: Int
    ROUTENAME: String
    ROUTENO: Int
    DPTCSEQNO: Int
  }

  type Query {
    route: [Route]
    busStop: [BusStop]
    routeDetail(id: Int!): [RouteDetail]
    arrival(id: Int!): [Arrival]
    timetable(id: Int!, day: Int!): [Timetable]
  }
`

const resolvers = {
  Query: {
    route: () => RouteInfo,
    busStop: () => BusStopInfo,
    routeDetail: async (_s, args, { dataSources }) => {
      return dataSources.busAPI.getRouteDetail(args)
    },
    arrival: async (_s, args, { dataSources }) => {
      return dataSources.busAPI.getArrival(args)
    },
    timetable: async (_s, args, { dataSources }) => {
      return dataSources.busAPI.getTimetable(args)
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      busAPI: new BusAPI(),
    }
  },
})

// start server
init()
  .then(() => {
    console.log("init complete")
    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
    })
  })
  .catch((err) => {
    if (err.response != undefined) {
      console.error("init fail:", err.response.statusText)
    } else {
      console.error("init fail:", err)
    }
  })

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`)
// })
