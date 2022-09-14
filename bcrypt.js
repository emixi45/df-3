const bcrypt = require('bcryptjs')

const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain, 10)
    return hash
}

const compare = async (plainPassword, hashPassword) => {
    return await bcrypt.compare(plainPassword, hashPassword)
}

module.exports = { encrypt, compare }