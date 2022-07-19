const {User} = require('../models')

exports.findUser = (id) => {
  return User.findByPk(
    id, 
    {
      attributes : {
        exclude : [
          'password',
          'recent_token'
        ]
      }
    }
  )
}
