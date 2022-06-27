const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectID } = require('mongodb')
require('dotenv').config()
const PORT = 3000

//connect to database
let db,
    collection,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix'
    

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log('Connected to the database')
        db = client.db(dbName)
        collection = db.collection('movies')
    })


//Middleware
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())


//CRUD
app.get('/search', async (req, res) => {
    try {
        let result = await collection.aggregate([
            {
                "$Search" : {
                    "autocomplete" : {
                        "query" : `${req.query.query}`,
                        "path" : "title",
                        "fuzzy" : {
                            "maxEdits" : 1,
                            "prefixLength" : 3
                        }
                    }
                }
            }
        ]).toArray()
        res.send(result)
    } catch (error){
        res.status(500).send({ message : error.message })
    }
})

app.get('/get/:id', async (req, res) => {
    try {
        let result = await collection.findOne({
            "_id" : ObjectID(req.params.id)
        })
        res.send(result)
    } catch (error){
        res.status(500).send({ message : error.message })
    }
})



//listen on port
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running`)
})