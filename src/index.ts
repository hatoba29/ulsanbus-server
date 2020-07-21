import { ApolloServer, gql } from "apollo-server"
import BusAPI from "./data_source"

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

  type Query {
    route: [Route]
  }
`

const resolvers = {
  Query: {
    route: async (_source, _args, { dataSources }) => {
      return dataSources.busAPI.getRoute()
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

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
