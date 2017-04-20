'use strict'

const {
  send
} = require('micro');
const isImage = require('is-image');
const {
  upload,
  move
} = require('micro-upload');
const path = require('path');
const uuid = require('uuid');


module.exports = upload(async(req, res) => {

  if (req.method.toLowerCase() !== 'post') {
    send(res, 405, {
      error: 'Invalid method please use POST'
    });
  }

  if (!req.files) {
    return send(res, 400, {
      error: 'No file uploaded'
    });
  }

  let file = req.files.file;

  if (!isImage(file.name)) {
    return send(res, 400, {
      error: 'Please use an image'
    });
  }

  let ext = path.extname(file.name);
  let name = uuid.v4() + ext;
  let finalPath = path.join(__dirname, 'uploads', name);

  await move(file, finalPath)

  send(res, 200, {
    name: name,
    src: finalPath
  })

})