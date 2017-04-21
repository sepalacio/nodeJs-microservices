'use strict'

const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const {
  json,
  send
} = require('micro');
const Filter = require('instagram_js_filter');
const effects = new Filter();

module.exports = async(req, res) => {
  const body = await json(req);
  const {
    name,
    filter
  } = body;
  const imagePath = path.join(__dirname, 'uploads', name);
  let data = '';
  let preview = '';
  let type = mime.lookup(imagePath);

  try {
    data = await convert(imagePath, filter);
    preview = `data: ${type}; base64, ${data.toString('base64')}`;
  } catch (err) {
    return send(res, 500, {
      'error': err.message
    });
  }

  return send(res, 200, {
    'image': imagePath,
    'data': data
  });
}

function convert(file, filter) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err);
      }
      const result = effects.apply(data, filter, {});
      resolve(result);
    })
  })
}