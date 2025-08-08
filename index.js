require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const db = require("./db")
const logger = require("./logger")
const router = require("./router")

const app = express()
const PORT = process.env.PORT || 3000

// middleware
app.use(bodyParser.json())

// mount router
app.use("/", router)

// middleware server error handler
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`)
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    })
})

// initialize the db
db.initialize()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`)
            logger.info(`Database connected: ${process.env.DB_NAME}`)
        })
    })
    .catch((err) => {
        logger.error("Failed to initialize database:", err)
        process.exit(1)
    })

module.exports = app
