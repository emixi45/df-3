const { createLogger, format, transports } = require('winston')

const logger = createLogger({
    level: 'warn',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console({level: 'verbose'}),
        new transports.File({filename: 'info.log', level: 'error'})
    ]
})

module.exports = logger