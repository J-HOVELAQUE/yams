import React from 'react';
import './App.css';
// import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import { Dice } from './components/dice.js';
import { Game } from './components/game';
import { Home } from './components/home';


// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max) + 1);
// };

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/new-game/:gameid" component={Game} />
        {/* <Route path="/load-game/:gameid" component={Game} /> */}
      </Switch>
    </Router>
  )

  // const [dicesData, setDicesData] = useState([]);
  // const [total, setTotal] = useState(0);

  // const [maximumPlayerOne, setMaximumPlayerOne] = useState("");
  // const [minimumPlayerOne, setMinimumPlayerOne] = useState("");
  // const [diffMaxiMiniPlayerOne, setDiffMaxiMiniPlayerOne] = useState("");


  // ///// Checker si maxi et mini sont rempli
  // useEffect(() => {
  //   if (maximumPlayerOne !== "" && minimumPlayerOne !== "") {
  //     setDiffMaxiMiniPlayerOne(maximumPlayerOne - minimumPlayerOne);
  //   }
  //   console.log('MAXI', maximumPlayerOne);
  //   console.log('MINI', minimumPlayerOne);
  // }, [maximumPlayerOne, minimumPlayerOne])

  // ///// Jeter les dé
  // const rollDices = (numb) => {
  //   let lance = [];
  //   for (let i = 0; i < numb; i++) {
  //     lance.push({
  //       value: getRandomInt(6),
  //       toReRoll: false,
  //       numberOfReRoll: 1
  //     });
  //   };
  //   setDicesData(lance);
  //   updateTotal(lance);
  // };

  // ///// Rejeter un dé
  // const reRollOne = (key) => {
  //   let actualState = [...dicesData];
  //   actualState[key] = ({
  //     value: getRandomInt(6),
  //     toReRoll: false,
  //     numberOfReRoll: actualState[key].numberOfReRoll + 1
  //   });
  //   setDicesData(actualState);
  //   updateTotal(actualState);
  // };


  // ///// Mise à jour du total
  // const updateTotal = (dices) => {
  //   const values = dices.map(dice => { return dice.value })
  //   const reducer = (acc, curr) => acc + curr;
  //   setTotal(values.reduce(reducer));
  // }

  // ///// Rejeter les dés sélectionné
  // const reRoll = () => {
  //   console.log('REROLL');

  //   let actualState = [...dicesData];
  //   for (let i = 0; i < actualState.length; i++) {
  //     if (actualState[i].toReRoll) {
  //       actualState[i] = {
  //         value: getRandomInt(6),
  //         toReRoll: false,
  //         numberOfReRoll: actualState[i].numberOfReRoll + 1
  //       }
  //     }
  //   }
  //   setDicesData(actualState);
  //   updateTotal(actualState);

  // }

  // ///// Déterminer les dés à relancer
  // const toReRoll = (key) => {
  //   let actualState = [...dicesData];
  //   actualState[key].toReRoll = !actualState[key].toReRoll;
  //   setDicesData(actualState);
  //   console.log(actualState);
  // }

  // ///// Génération des dés
  // let myThrow = dicesData.map((dice, i) => {
  //   return <Dice face={dice.value} key={i} id={i} reRoll={toReRoll} toLight={dice.toReRoll} numberOfReRoll={dice.numberOfReRoll}></Dice>
  // });

  // ///// Remplir case maximum du joueur
  // const fillMax = () => {
  //   if (maximumPlayerOne === "") {
  //     setMaximumPlayerOne(total)
  //   }
  // }

  // ///// Remplir case minimum du joueur
  // const fillMin = () => {
  //   if (minimumPlayerOne === "") {
  //     setMinimumPlayerOne(total)
  //   }
  // }

  // ///// Rendu
  // return (
  //   <div className="App">
  //     <div className="playingTable">

  //       {myThrow}
  //     </div>
  //     {/* <button onClick={() => { rollDices(5) }}>Roll</button> */}
  //     <Button variant="outline-success" className="button" onClick={() => { rollDices(5) }}>Roll</Button>
  //     <Button variant="outline-success" className="button" onClick={() => { reRoll() }}>Re-Roll</Button>
  //     <h1>Total: {total}</h1>
  //     <Table striped bordered hover variant="dark" className='grille'>
  //       <thead>
  //         <tr>
  //           <th>Joueur</th>
  //           <th>1</th>
  //           <th>2</th>
  //           <th>3</th>
  //           <th>3</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           <td>Maximum</td>
  //           <td onClick={() => { fillMax() }}>{maximumPlayerOne}</td>
  //           <td></td>
  //           <td></td>
  //           <td></td>
  //         </tr>
  //         <tr>
  //           <td>Minimum</td>
  //           <td onClick={() => { fillMin() }}>{minimumPlayerOne}</td>
  //           <td></td>
  //           <td></td>
  //           <td></td>
  //         </tr>
  //         <tr>
  //           <td>TOTAL</td>
  //           <td>{diffMaxiMiniPlayerOne}</td>
  //           <td></td>
  //           <td></td>
  //           <td></td>
  //         </tr>

  //       </tbody>
  //     </Table>
  //     {total === 30 ? <h1>BRAVO!!!!</h1> : <h1> </h1>}

  //   </div>
  // );
}

export default App;
