import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";

import { resolvers } from "./resolver/resolvers";
import { Crawler } from "./services";
import { stockDailyInfoList } from "@service/stock-info/stock-info";
const port: number | string = process.env.PORT || 3000;

const typeDefs = importSchema(__dirname + "/schema/schema.graphql");

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false }
});

const options = {
  port,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

server.start(options, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
// daily crawler
const initDate = new Date(new Date().setDate(new Date().getDate() - 5));
const crawler = new Crawler(initDate);
crawler.init();
