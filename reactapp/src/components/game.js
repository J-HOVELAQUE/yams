import React, { useState, useEffect } from 'react';
import '../App.css';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Dice } from './dice.js';
import { connect } from 'react-redux';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
};

const chiffres = ['AS', 'DEUX', 'TROIS', 'QUATRE', 'CINQ', 'SIX'];

function Game(props) {

    console.log('REDUCER', props);

    /// Charger une partie /////
    const loadGame = async (nameGrid) => {
        // setNoUpdate(true);
        const dataGridRaw = await fetch(`/get-score/${nameGrid}`);
        const dataGrid = await dataGridRaw.json();
        console.log('Grid Loaded:', dataGrid);

        // setGrid(dataGrid);
        setGrid(dataGrid.grid);
    }

    ////Initialisation de la partie
    useEffect(() => {
        async function startGame() {
            for (let i = 0; i < props.playerNames.length; i++) {
                await fetch(`/create-grid?name=${props.playerNames[i]}`);
            }
        };
        startGame();
    }, []);

    ///////////
    const [dicesData, setDicesData] = useState([]);
    const [total, setTotal] = useState(0);

    const [activePlayer, setActivePlayer] = useState(0);

    const [totalRolls, setTotalRolls] = useState(0);


    const [totalChiffre, setTotalChiffre] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [totalI, setTotalI] = useState(0);
    const [totalII, setTotalII] = useState(0);
    const [totalIII, setTotalIII] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [grid, setGrid] = useState(props.playerNames);

    //// Enregistrement de la grille
    useEffect(() => {
        async function updateGrid() {
            await fetch('/write-score', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(grid)
            });
        };
        updateGrid();

        // Vérifier si la partie est finie //
        let isFinished = true;
        for (const key in grid) {
            if (grid[key] === "") {
                console.log(grid[key]);
                isFinished = false;
            }
        };
        console.log('Finish?', isFinished);
        console.log('Game ?', gameFinished);
        if (isFinished) { setGameFinished(true) };
    }, [grid]);

    ///// Calculer le résultat final si la partie est terminée /////
    useEffect(() => {
        setFinalTotal(totalI + totalII + totalIII);
    }, [gameFinished])

    ///// Mise à jour du bonus si besoin /////
    useEffect(() => {
        if (totalChiffre >= 63) {
            setBonus(35);
            setTotalI(totalI + 35);
        };
    }, [totalChiffre]);


    ///// Passer à la manche suivante /////
    const newRound = () => {
        console.log('joueur', activePlayer);
        console.log('longueur grille', grid.length);
        if (activePlayer === grid.length - 1) {
            setActivePlayer(0);
        } else {
            setActivePlayer(activePlayer + 1);
        };
        setTotal(0);
        setDicesData([]);
        setTotalRolls(0);
    }

    ///// Jeter les dé //////
    const rollDices = (numb) => {
        let lance = [];
        for (let i = 0; i < numb; i++) {
            lance.push({
                value: getRandomInt(6),
                toReRoll: false,
                numberOfReRoll: 1
            });
        };
        setDicesData(lance);
        updateTotal(lance);
        setTotalRolls(1);
    };

    ///// Rejeter les dés sélectionné //////
    const reRoll = () => {
        if (totalRolls < 3) {
            let actualState = [...dicesData];
            for (let i = 0; i < actualState.length; i++) {
                if (actualState[i].toReRoll) {
                    actualState[i] = {
                        value: getRandomInt(6),
                        toReRoll: false,
                        numberOfReRoll: actualState[i].numberOfReRoll + 1
                    }
                }
            }
            setTotalRolls(totalRolls + 1);
            setDicesData(actualState);
            updateTotal(actualState);
        }
    }

    ///// Mise à jour du total //////
    const updateTotal = (dices) => {
        const values = dices.map(dice => { return dice.value })
        const reducer = (acc, curr) => acc + curr;
        setTotal(values.reduce(reducer));
    }

    ///// Déterminer les dés à relancer //////
    const toReRoll = (key) => {
        let actualState = [...dicesData];
        actualState[key].toReRoll = !actualState[key].toReRoll;
        setDicesData(actualState);
    }

    ///// Transformer dice data en objet pour faciliter la validation des combinaisons /////
    const diceDataToObject = () => {
        const dataInObject = {};
        dicesData.forEach(dice => {
            let chiffreEnLettre = chiffres[dice.value - 1];
            if (dataInObject[chiffreEnLettre] === undefined) {
                dataInObject[chiffreEnLettre] = 1;
            } else {
                dataInObject[chiffreEnLettre] = dataInObject[chiffreEnLettre] + 1
            }
        })
        return dataInObject;
    }

    ///// Remplir la case des Chiffres /////
    const fillNumber = (numb) => {
        const chiffreEnLettre = chiffres[numb - 1];
        if (grid[chiffreEnLettre] === "") {
            let totalNumb = 0;
            dicesData.forEach(dice => {
                if (dice.value === numb) { totalNumb += (1 * numb) }
            });
            const update = {};
            update[chiffreEnLettre] = totalNumb;
            setGrid({ ...grid, ...update });
            setTotalChiffre(totalChiffre + totalNumb);
            setTotalI(totalI + totalNumb);
            newRound();
        }
    }

    const fillNumberMulti = (numb, player) => {
        const chiffreEnLettre = chiffres[numb - 1];
        if (player === activePlayer) {
            if (grid[player][chiffreEnLettre] === "") {
                let totalNumb = 0;
                dicesData.forEach(dice => {
                    if (dice.value === numb) { totalNumb += (1 * numb) }
                });
                const update = {};
                update[chiffreEnLettre] = totalNumb;
                let updatedGrid = { ...grid[player], ...update };
                let copyGrid = [...grid];
                copyGrid[player] = updatedGrid;
                setGrid(copyGrid);
                setTotalChiffre(totalChiffre + totalNumb);
                setTotalI(totalI + totalNumb);
                newRound();
            }
        }
    }

    ///// Remplir case maximum du joueur /////
    const fillMax = () => {
        if (grid.maximum === "") {
            const update = { maximum: total }
            setGrid({ ...grid, ...update });
            newRound();
        }
    }

    const fillMaxMulti = (i) => {
        if (grid[i].maximum === "") {

            const update = { maximum: total }
            let updateGrid = { ...grid[i], ...update };
            let newGrid = [...grid];
            newGrid[i] = updateGrid
            setGrid(newGrid);
            newRound();
        }
    }

    ///// Remplir case minimum du joueur /////
    const fillMin = () => {
        if (grid.minimum === "") {
            const update = { minimum: total }
            setGrid({ ...grid, ...update });
            newRound();
        }
    }

    ///// Remplir la case de la suite /////
    const fillSuite = () => {
        const values = dicesData.map((dice) => { return dice.value });
        const sortedValues = values.sort();
        console.log('trié', sortedValues);
        let validate = true;
        for (let i = 0; i < sortedValues.length; i++) {
            if ((sortedValues[i] - 1 !== (sortedValues[i - 1]) && (i !== 0))) {
                validate = false
            }
        };
        let point = 0;
        if (validate) { point = 30 };

        const update = {};
        update.suite = point;
        setGrid({ ...grid, ...update });
        setTotalIII(totalIII + point);
        newRound();
    }

    ///// Remplir la case du full /////
    const fillFull = () => {
        if (grid.full === "") {
            let validateThree = false;
            let validateTwo = false;
            const dicesToObject = diceDataToObject();
            for (const property in dicesToObject) {
                if (dicesToObject[property] === 3) {
                    validateThree = true;
                }
            };
            for (const property in dicesToObject) {
                if (dicesToObject[property] === 2) {
                    validateTwo = true
                }
            }

            let point = 0;
            if (validateTwo === true && validateThree === true) { point = 30 };

            const update = {};
            // update.full = total;
            update.full = point;
            setGrid({ ...grid, ...update });
            setTotalIII(totalIII + point);
            newRound();

        }
    }

    ///// Remplir la case du carré /////
    const fillFigure = (nomCombin, toReach) => {
        if (grid[nomCombin] === "") {
            let validate = false;
            const dicesToObject = diceDataToObject();
            // console.log(dicesToObject);
            for (const property in dicesToObject) {
                if (dicesToObject[property] >= toReach) {
                    validate = true;
                }
            }

            let point = 0;
            if (validate) {
                point = toReach * 10
            }
            const update = {};
            update[nomCombin] = point;
            setTotalIII(totalIII + point);
            setGrid({ ...grid, ...update });
            newRound();
        }

    }

    ///// Génération des dés /////
    let myThrow = dicesData.map((dice, i) => {
        return <Dice face={dice.value} key={i} id={i} reRoll={toReRoll} toLight={dice.toReRoll} numberOfReRoll={dice.numberOfReRoll}></Dice>
    });

    console.log('GRILLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', grid);
    //////////////////////////////////////////////////////////////////////     Génération case de la grille    ///////////////////////////////////////////////////////////////////////////
    const caseName = grid.map((elem) => { return (<td>{elem.name}</td>) });

    const caseAs = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(1, i) }}>{elem.AS}</td>) })
    const caseDeux = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(2, i) }}>{elem.DEUX}</td>) })
    const caseTrois = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(3, i) }}>{elem.TROIS}</td>) })
    const caseQuatre = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(4, i) }}>{elem.QUATRE}</td>) })
    const caseCinq = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(5, i) }}>{elem.CINQ}</td>) })
    const caseSix = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(6, i) }}>{elem.SIX}</td>) })

    ///// Rendu
    return (
        <div className="App"><div className="grille">
            <Table striped bordered hover variant="dark" className='grille'>
                <thead>
                    <tr>
                        <th>Joueur</th>
                        {caseName}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>AS</td>
                        {caseAs}
                    </tr>
                    <tr>
                        <td>DEUX</td>
                        {caseDeux}
                    </tr>
                    <tr>
                        <td>TROIS</td>
                        {caseTrois}
                    </tr>
                    <tr>
                        <td>QUATRE</td>
                        {caseQuatre}
                    </tr>
                    <tr>
                        <td>CINQ</td>
                        {caseCinq}
                    </tr>
                    <tr>
                        <td>SIX</td>
                        {caseSix}
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>TOTAL</td>
                        <td>
                            {(grid.AS !== "" && grid.DEUX !== "" && grid.TROIS !== "" && grid.QUATRE !== "" && grid.CINQ !== "" && grid.SIX !== "") ? totalChiffre : null}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>BONUS</td>
                        <td>{bonus}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>TOTAL I</td>
                        <td>
                            {(grid.AS !== "" && grid.DEUX !== "" && grid.TROIS !== "" && grid.QUATRE !== "" && grid.CINQ !== "" && grid.SIX !== "") ? totalI : null}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Maximum</td>

                        <td onClick={() => { fillMax() }}>{grid.maximum}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Minimum</td>
                        <td onClick={() => { fillMin() }}>{grid.minimum}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>TOTAL II</td>
                        <td>{(grid.minimum !== "" && grid.maximum !== "") ? grid.maximum - grid.minimum : null}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>SUITE</td>
                        <td onClick={() => { fillSuite() }}>{grid.suite}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>FULL</td>
                        <td onClick={() => { fillFull() }}>{grid.full}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>CARRE</td>
                        <td onClick={() => { fillFigure('carre', 4) }}>{grid.carre}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>YAM</td>
                        <td onClick={() => { fillFigure('yams', 5) }}>{grid.yams}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>TOTAL III</td>
                        <td>
                            {(grid.full !== "" && grid.carre !== "" && grid.suite !== "" && grid.yams !== "") ? totalIII : null}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>SCORE FINAL</td>
                        <td>
                            {gameFinished ? finalTotal : null}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                </tbody>
            </Table>
        </div>
            <div className="command">
                <h1>{grid[activePlayer].name}</h1>

                <div className="playingTable">

                    {myThrow}
                </div>
                {/* <button onClick={() => { rollDices(5) }}>Roll</button> */}
                <div>
                    <Button variant="outline-success" className="button" onClick={() => { rollDices(5) }}>Roll</Button>
                    <Button variant="outline-success" className="button" onClick={() => { reRoll() }}>Re-Roll</Button>
                    <Button variant="outline-success" className="button" onClick={() => { loadGame('toto') }}>Load Game</Button>
                </div>
                <h1>Total: {total}  Roll: {totalRolls}</h1>

                {total === 30 ? <h1>BRAVO!!!!</h1> : <h1> </h1>}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { playerNames: state.playerNames }
}

export default connect(
    mapStateToProps,
    null
)(Game);