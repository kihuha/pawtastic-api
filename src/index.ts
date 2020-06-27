import { ApolloServer, gql, UserInputError } from "apollo-server"
import "./db/mongoose"
import User from "./db/models/User"

const port = process.env.PORT || 4000

const typeDefs = gql`
  type User {
    _id: ID
    email: String
    password: String
    phone: String
    phoneAlt: String
    firstName: String
    lastName: String
    city: String
    created: Float
    updated: Float
  }

  type Error {
    error: String
  }

  type Query {
    allUsers: [User]
  }

  type Mutation {
    createUser(
      email: String!
      password: String!
      phone: String!
      phoneAlt: String
      firstName: String!
      lastName: String!
      city: String!
    ): User
    updateUser(
      id: String
      email: String
      password: String
      phone: String
      phoneAlt: String
      firstName: String
      lastName: String
      city: String!
    ): User
    deleteUser(id: String): User
    userInputError(input: String): String
  }
`

const resolvers = {
  Query: {
    async allUsers() {
      const allUsers = await User.find({})
      return allUsers
    },
  },
  Mutation: {
    async createUser(_: any, args: any) {
      try {
        const newUser = await new User(args).save()
        return newUser
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: Object.keys(e.keyValue),
        })
      }
    },
    async updateUser(_: any, args: any) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          args.id,
          {
            email: args.email,
            password: args.password,
            phone: args.phone,
            phoneAlt: args.phoneAlt,
            firstName: args.firstName,
            lastName: args.lastName,
            city: args.city,
          },
          { new: true }
        )

        return updatedUser
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: Object.keys(e.keyValue),
        })
      }
    },
    async deleteUser(_: any, args: any) {
      try {
        const deletedUser = await User.findByIdAndDelete(args.id)

        return deletedUser
      } catch (e) {
        throw new UserInputError(e.message, {
          invalidArgs: Object.keys(e.keyValue),
        })
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }: any) {
    const token = req.headers.authorization
    return token
  },
})

server.listen(port).then(({ url }: any) => {
  return `🚀 Server is running on ${url}`
})
