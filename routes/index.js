var express = require('express');
const { LoopDetected } = require('http-errors');
var router = express.Router();

const GridModel = require('../database/models/grid');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/write-score', async function (req, res, next) {

  req.body.forEach(async (grid) => {
    console.log(grid);

    await GridModel.updateOne({ name: grid.name },
      {
        AS: grid.AS,
        DEUX: grid.DEUX,
        TROIS: grid.TROIS,
        QUATRE: grid.QUATRE,
        CINQ: grid.CINQ,
        SIX: grid.SIX,
        minimum: grid.minimum,
        maximum: grid.maximum,
        suite: grid.suite,
        full: grid.full,
        carre: grid.carre,
        yams: grid.yams
      });
  });
  res.json({ message: 'grid update ok' });
});

router.get('/create-grid', async function (req, res, next) {
  const newGrid = new GridModel({
    name: req.query.name
  });
  res.json({ message: 'grid created' });
  await newGrid.save();
});

router.get('/get-score', async function (req, res, next) {
  const userGrid = await GridModel.find();
  res.json({
    message: 'get data',
    grid: userGrid
  });
})

module.exports = router;
