const db = require('../db')

const createOrUpdate = async (req, res, next) => {
    try {
        const entries = Object.entries(req.body) 
        if (entries.length !== 1) {
            return res.status(201).json({
                error: 'Request must contain exactly one key-value pair'
            })
        }

        const [key, value] = entries[0]
        const timestamp = Math.floor(Date.now() / 1000)

        await db.query(
            'INSERT INTO key_value_history (key_name, value, timestamp) VALUES (?, ?, ?)',
            [key, JSON.stringify(value), timestamp]
        )

        res.status(201).json({
            key,
            value,
            timestamp
        })
    } catch (err) {
        next(err)
    }
}

const getByKey = async (req, res, next) => {
    try {
        const { key } = req.params
        const { timestamp } = req.query
        let result
        if (timestamp) {
            result = await getValueAtTime(key, parseInt(timestamp))
        } else {
            result = await getLatestValue(key)
        }

        if (!result) {
            return res.status(404).json({error: 'Key not found 2025'})
        }

        res.json({ value: result.value })
    } catch (err) {
        next(err)
    }
}

// get latest value
const getLatestValue = async (key) => {
    const [results] = await db.query(
        `SELECT value, timestamp FROM key_value_history 
        WHERE key_name = ? ORDER BY timestamp DESC LIMIT 1
        `,
        [key]
    )
    return results || null
}

// get value at given time
const getValueAtTime = async (key, timestamp) => {
    const [results] = await db.query(
        `SELECT value FROM key_value_history 
        WHERE key_name = ? AND timestamp <= ? 
        ORDER BY timestamp DESC LIMIT 1
        `,
        [key, timestamp]
    )

    return results || null
}

module.exports = {
    createOrUpdate,
    getByKey
}