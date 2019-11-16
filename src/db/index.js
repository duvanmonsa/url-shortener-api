'use strict'

const { MongoClient } = require('mongodb')

const mongoUrl = process.env.MONGO_URL;
let connection

// Conecta a la db y hace un pool de la conexión para reusar
const connectDB = async () => {
  if (connection) return connection

  let dbConnection, client
  try {
    client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true
    })
    dbConnection = client.db('shortener');
  } catch (err) {
    console.error('Could not connect to the DB', mongoUrl, err)
    process.exit(1)
  }

  connection = dbConnection
  return connection
}

const saveShortUrl = async (newShortUrl) => {
  let db, shortUrl;
  try {
    db = await connectDB()
    shortUrl = await db.collection('shortUrls').insertMany(newShortUrl)
  } catch (error) {
    console.error(error)
    throw error
  }
  return shortUrl
}

const getShortUrlByHash = async (hash) => {
  let db, shortUrl;
  try {
    db = await connectDB()
    shortUrl = await db.collection('shortUrls').findOne({ hash })
  } catch (error) {
    console.error(error)
    throw error
  }
  return shortUrl
}

module.exports = {
  saveShortUrl,
  getShortUrlByHash
}
