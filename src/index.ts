import { ApolloServer, gql } from "apollo-server"
import { parseString } from "xml2js"
import axios from "axios"
import BusAPI from "./data_source"
import config from "./config"

// init RouteInfo, BusStopInfo
let RouteInfo = []
let BusStopInfo = []
async function init() {
  await axios
    .get(config.baseURL + "RouteInfo.xo" + config.key + config.defaultInput)
    .then((response) => {
      parseString(response.data, config.xmlOptions, (err, result) => {
        RouteInfo = result.tableInfo.list.row
      })
      console.log("RouteInfo init complete")
    })
    .catch((res) => {
      console.error(`BusStopInfo Init ${res}`)
      throw res
    })

  await axios
    .get(config.baseURL + "BusStopInfo.xo" + config.key + config.defaultInput)
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

  type Query {
    route: [Route]
    busStop: [BusStop]
  }
`

const resolvers = {
  Query: {
    route: () => RouteInfo,
    busStop: () => BusStopInfo,
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
  .catch(() => {
    console.error("init fail")
  })
