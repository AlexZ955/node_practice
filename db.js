const mysql = require('mysql2/promise')
const logger = require('./logger')

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const initialize = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS object_store (
                id INT AUTO_INCREMENT PRIMARY KEY,
                key_name VARCHAR(255) NOT NULL,
                value JSON NOT NULL,
                timestamp BIGINT NOT NULL,
                INDEX idx_key (key_name),
                INDEX idx_key_timestamp (key_name, timestamp)
            )
        `)
        logger.info('Databalse initialized')
    } catch (err) {
        logger.error('Database initialization error:', error)
        throw err
    }
}

const query = async (sql, params) => {
    try {
        const [result] = await pool.query(sql, params)
        return result
    } catch (err) {
        logger.error(`Database query error: ${sql}`, err)
        throw new Error('Database opreation failed')
    }
}

module.exports = {
    initialize,
    query
}

