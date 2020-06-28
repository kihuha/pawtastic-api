const functions = require("firebase-functions")
const express = require("Express")
const cors = require("cors")({ origin: true })
const admin = require("firebase-admin")
const serviceAccount = require("../pawtastic-key.json")

import { ApolloServer, gql } from "apollo-server-express"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
const db = admin.firestore()

const typeDefs = gql`
  type Profile {
    email: String
    phone: String
    phoneAlt: String
    firstName: String
    lastName: String
    city: String
  }

  type Query {
    allUsers: [Profile]
  }
`

const resolvers = {
  Query: {
    async allUsers() {
      try {
        const allDocs: any = []
        const snapshot = await db.collection("profiles").get()

        snapshot.forEach((doc: any) => {
          allDocs.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        return allDocs
      } catch (e) {
        console.log(e)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
})
const app = express()
app.use(cors)
server.applyMiddleware({ app })

export const pawtastic = functions.https.onRequest(app)
