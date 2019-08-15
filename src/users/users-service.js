const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/


const UsersService = {
    emailInUse(db, email) {
        return db('greenhouse_users')
            .where({ email })
            .first()
            .then(user => !!user)
    },
    hasUserWithUserName(db, user_name) {
        return db('greenhouse_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
            return 'Password must contain at least 1 uppercase letter and at least 1 number'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            email: xss(user.email),
            user_name: xss(user.user_name)
        }
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('greenhouse_users')
            .returning('*')
            .then(([user]) => user)
    }
  }
  
  module.exports = UsersService