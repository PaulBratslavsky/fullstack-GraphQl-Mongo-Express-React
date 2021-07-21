const express = require('express')
const app = express()
const expressPlayground = require('graphql-playground-middleware-express')
  .default
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const mongose =  require('mongoose')
const cors = require('cors')

const User = require('./models/user')

app.use(cors())
app.use(express.json())
app.get('/graphql', expressPlayground({ endpoint: '/graphql' }))
app.use('/graphql',graphqlHTTP({
  schema: buildSchema(`

    type RootQuery {
      user(id: ID!): User!
    }

    type RootMutation {
      addUser(userInput: UserInput!): User!
    }

    type User {
      _id: ID!
      password: String!
      email: String!
    }

    input UserInput {
      password: String!
      email: String!
    }

    schema {
      query: RootQuery,
      mutation: RootMutation,
    }

  `),
  rootValue: {
    
    user: async args => {
      try {

        const user = await User.findOne({ _id:args.id })
        return { ...user._doc }       

      } catch (error) {
        console.error("SERVER ERROR ", error)

      }
    },

    addUser: async args => {
      try {

        const user = new User({
          email: args.userInput.email,
          password: args.userInput.password,
        })

        const result = await user.save()
        return { ...result._doc }

      } catch (error) {
        console.error("SERVER ERROR ", error)
      }
    }

  },
  graphiql: true
}))

const PORT = process.env.PORT || 5000
mongose.connect(`mongodb+srv://CodingAdminThirty:kl453j6kl456j534m@cluster0.z8xy6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log("Running")
  })
}).catch(error => console.error("SERVER ERROR: ", error)) 

// mongodb+srv://CodingAdminThirty:<password>@cluster0.z8xy6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

