var express = require('express');
const { LoopDetected } = require('http-errors');
var router = express.Router();

const GridModel = require('../database/models/grid');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/write-score', async function (req, res, next) {
  console.log(req.body);
  await GridModel.updateOne({ name: req.body.name },
    {
      AS: req.body.AS,
      DEUX: req.body.DEUX,
      TROIS: req.body.TROIS,
      QUATRE: req.body.QUATRE,
      CINQ: req.body.CINQ,
      SIX: req.body.SIX,
      minimum: req.body.minimum,
      maximum: req.body.maximum,
      total: req.body.total
    });
  res.json({ message: 'grid update ok' });
});

router.get('/create-grid', async function (req, res, next) {
  const newGrid = new GridModel({
    name: req.query.name,
    maximum: 0,
    minimum: 0,
    total: 0
  });
  res.json({ message: 'grid created' });
  await newGrid.save();
});

router.get('/get-score/:playerName', async function (req, res, next) {
  console.log('PROCESS');
  console.log('JOUEUR', req.params.playerName);
  const userGrid = await GridModel.findOne({ name: req.params.playerName });
  res.json({
    message: 'get data',
    grid: userGrid
  });
})

module.exports = router;
