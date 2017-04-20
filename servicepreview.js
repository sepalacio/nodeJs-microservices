'use strict'

const {
  json
} = require('micro');


module.exports = (req, res) => {
  const body = json(req);

  return body;

}