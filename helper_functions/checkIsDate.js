const moment = require('moment')

function isDate(date){
  const isDateValid = moment(date, "YYYY-MM-DD", true).isValid()

  if(isDateValid !== true){
    return true
  }
}

module.exports = isDate