const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { events, locations, users, participants } = require("./data.js");
const typeDefs = gql`
  type Event {
    id: Int
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: Int
    user_id: Int
    user: [User]!
    participant: [Participant]!
    location: [Location]!
  }

  type Location {
    id: Int
    name: String
    desc: String
    lat: Float
    lng: Float
  }

  type User {
    id: Int
    username: String
    email: String
  }

  type Participant {
    id: Int
    user_id: Int
    event_id: Int
  }

  type Query {
    # Events
    events: [Event!]!
    event(id: Int!): Event!
    # Locations
    locations: [Location]!
    location(id: Int!): Location!
    # Users
    users: [User]!
    user(id: Int!): User!
    # Participants
    participants: [Participant]
    participant(id: Int!): Participant!
  }
`;
const resolvers = {
  Query: {
    // Events
    events: () => events,
    event: (parent, args) => events.find((item) => item.id == args.id),
    // Locations
    locations: () => locations,
    location: (parent, args) => locations.find((item) => item.id == args.id),
    // Users
    users: () => users,
    user: (parent, args) => users.find((item) => item.id == args.id),
    // Participants
    participants: () => participants,
    participant: (parent, args) => {
      return participants.find((item) => item.id == args.id);
    },
  },
  Event: {
    user: (parent, args) => users.filter((item) => item.id == parent.user_id),
    participant: (parent, args) =>
      participants.filter((item) => item.event_id == parent.location_id),
    location: (parent, args) =>
      locations.filter((item) => item.id == parent.location_id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀 Server Running on ${url}`);
  })
  .catch((err) => console.log(err));
