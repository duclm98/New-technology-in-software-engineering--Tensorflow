var express = require('express');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const sizeOf = require('image-size');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Tensorflow'
  });
});

router.get('/unet', function (req, res) {
  res.render('unet', {
    title: 'UNET Demo'
  });
});

router.get('/pose', function (req, res) {
  res.render('pose', {
    title: 'Pose estimation'
  });
});

router.post('/pose-estimation', async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (files.image.name === '') {
      return res.status(400).send('Vui lòng chọn hình ảnh trước.');
    }
    const oldpath = files.image.path;
    const newpath = path.join(__dirname, `../public/images/image.png`);

    const readStream = fs.createReadStream(oldpath);
    const writeStream = fs.createWriteStream(newpath);
    readStream.pipe(writeStream);
    readStream.on('end', async function () {
      fs.unlinkSync(oldpath);

      const dimensions = sizeOf('public/images/image.png');
      const width = dimensions.width,
        height = dimensions.height;

      return res.render('pose', {
        title: 'Pose estimation',
        width,
        height
      });
      
    });
  });
})

module.exports = router;