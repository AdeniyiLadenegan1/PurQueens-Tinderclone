const PORT = 8000
const express = require('express')
const { MongoClient } = require('mongodb')
const { v1: uuidv1 } = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()




const uri = process.env.URI

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
    // res.json('Hello there, we are live')
})

app.post('/signup', async (req, res) => {
    const clients = new MongoClient(uri)
    const { email, password } = req.body
    const generatedUserId = uuidv1()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await clients.connect()
        const database = clients.db('queens-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return res.status(409).send('users profile already exists')
        }

        const sanitizedEmail = email.toLowerCase()
        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)
        const token = jwt.sign(insertedUser, sanitizedEmail, {
            // expiresIn: 60 * 120,
        })

        res.status(200).json({ token, userId: generatedUserId, email: sanitizedEmail })

    } catch (err) {
        console.log(err)
    }
})

//oldcode
// app.post('/login', async (req, res) => {
//     const clients = new MongoClient(uri)
//     const { email, password } = req.body

//     console.log('my password is' + password + " " + email)
//     // const hashed_password = await bcrypt.hash(password, 10)
//     // console.log('my password is' + hashed_password)

//     try {
//         await clients.connect()
//         const database = clients.db('queens-data')
//         const users = database.collection('users')
//         const user = await users.findOne({ email })
       
//         if (user === null)

//         console.log('my hashedPassword is' + JSON.stringify(user))
//         const correctPassword = await bcrypt.compare(password, user.hashed_password)

//         if (user && correctPassword) {
//             const token = jwt.sign(user, email, {
//                 expiresIn: 60 * 120
//             })
//             return res.status(200).json({ token, userId: user.user_id, email })
//             //if i dont want to return the userid and email
//         }
//         res.status(400).send('Invalid Credentials')

//     } catch (err) {
//         console.log(err)
//     }
// })


//oldcode ends


//chatgpt starts

app.post('/login', async (req, res) => {
    const clients = new MongoClient(uri)
    const { email, password } = req.body
  
    console.log('my password is' + password + " " + email)
  
    try {
      await clients.connect()
      const database = clients.db('queens-data')
      const users = database.collection('users')
      const user = await users.findOne({ email })
  
      if (user === null) {
        return res.status(400).send('Invalid Credentials')
      }
  
      console.log('my hashedPassword is' + JSON.stringify(user))
      const correctPassword = await bcrypt.compare(password, user.hashed_password).catch(error => {
        console.log(error)
        return res.status(500).send('Internal Server Error')
      })
  
      if (user && correctPassword) {
        const token = jwt.sign(user, email, {
          expiresIn: 60 * 120
        })
        return res.status(200).json({ token, userId: user.user_id, email })
      }
  
      res.status(400).send('Invalid Credentials')
    } catch (err) {
      console.log(err)
    }
  })
  



//chatgpt code ends


app.get('/user', async (req, res) => {
    const clients = new MongoClient(uri)
    const userId = req.query.userId
    // console.log('userId', userId)

    try {
        await clients.connect()
        const database = clients.db('queens-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const user = await users.findOne(query)

        res.send(user)
    } finally {
        await clients.close()
    }
})

app.get('/users', async (req, res) => {

    const clients = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)
    // console.log(userIds)

    try {
        await clients.connect()
        const database = clients.db('queens-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()
        // console.log(foundUsers)
        res.send(foundUsers)

    } finally {
        await clients.close()
    }
})

// getting users
app.get('/gendered-users', async (req, res) => {
    const clients = new MongoClient(uri)
    const gender = req.query.gender

    // console.log('gender', gender)
    try {
        await clients.connect()
        const database = clients.db('queens-data')
        const users = database.collection('users')
        const query = { gender_identity: { $eq: gender } }
        const foundUsers = await users.find(query).toArray()

        //const returnedUsers = await users.find().toArray()
        res.send(foundUsers)

    } finally {
        await clients.close()
    }
})

app.put('/user', async (req, res) => {
    const clients = new MongoClient(uri)
    const formData = req.body.formData

    // console.log(formData)
    try {

        await clients.connect()
        const database = clients.db('queens-data')
        const users = database.collection('users')

        const query = { user_id: formData.user_id }
        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                email: formData.email,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            },
        }
        const insertedUser = await users.updateOne(query, updateDocument)
        res.send(insertedUser)

    } finally {
        await clients.close()
    }
})
app.put('/addmatch', async (req, res) => {
    const clients = new MongoClient(uri)
    const { userId, matchedUserId } = req.body


    try {
        await clients.connect()
        const database = clients.db('queens-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const updateDocument = {
            $push: { matches: { user_id: matchedUserId } },
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await clients.close()
    }
})

app.get('/messages', async (req, res) => {
    const clients = new MongoClient(uri)
    const { userId, correspondingUserId } = req.query
    // console.log(userId, correspondingUserId)

    try {
        await clients.connect()
        const database = clients.db('queens-data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }

        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)

    } finally {
        await clients.close()
    }
})

app.post('/message', async (req, res) => {
    const clients = new MongoClient(uri)
    const message = req.body.message

    try {
        await clients.connect()
        const database = clients.db('queens-data')
        const messages = database.collection('messages')
        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await clients.close()
    }
})




app.listen(PORT, () => console.log('My server is running on port ' + PORT))