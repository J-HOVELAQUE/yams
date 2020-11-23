/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import '../App.css';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Dice } from './dice.js';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
};

const chiffres = ['AS', 'DEUX', 'TROIS', 'QUATRE', 'CINQ', 'SIX'];

function Game(props) {

    useEffect(() => {
        async function startGame() {
            for (let i = 0; i < props.playerNames.length; i++) {
                await fetch(`/create-grid?name=${props.playerNames[i].name}`);
            }
        };
        startGame();
        let updatedTotal = [];

        for (let i = 0; i < props.playerNames.length; i++) {
            updatedTotal.push("");
        }
        setTotalI(updatedTotal);
        setTotalII(updatedTotal);
        setTotalIII(updatedTotal);
        setTotalChiffre(updatedTotal);
        setBonus(updatedTotal);
        setFinalTotal(updatedTotal);
    }, []);

    ///////////
    const [dicesData, setDicesData] = useState([]);
    const [total, setTotal] = useState(0);

    const [activePlayer, setActivePlayer] = useState(0);

    const [totalRolls, setTotalRolls] = useState(0);
    const [actualRound, setActualRound] = useState(false);

    const [totalChiffre, setTotalChiffre] = useState([]);
    const [bonus, setBonus] = useState([]);
    const [totalI, setTotalI] = useState([]);
    const [totalII, setTotalII] = useState([]);
    const [totalIII, setTotalIII] = useState([]);
    const [finalTotal, setFinalTotal] = useState([]);
    const [gameFinished, setGameFinished] = useState(false);
    const [grid, setGrid] = useState(props.playerNames);

    /////////////////////////////////////////////////////     Chaque fois que la grille est modifiée     //////////////////////////////////////////////

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

        let isFinish = true;
        for (let i = 0; i < grid.length; i++) {

            ///// Vérifier si mini et maxi sont rempli /////
            if (grid[i].maximum !== "" && grid[i].minimum !== "") {
                const update = grid[i].maximum - grid[i].minimum;
                let updateTotalII = [...totalII];
                updateTotalII[i] = update;
                setTotalII(updateTotalII);
            } else {
                isFinish = false
            }

            ///// Vérifier si tous les chiffres sont remplis /////
            if (grid[i].AS !== ""
                && grid[i].DEUX !== ""
                && grid[i].TROIS !== ""
                && grid[i].QUATRE !== ""
                && grid[i].CINQ !== ""
                && grid[i].SIX !== "") {
                console.log('>>>>>>>>>>>>>>>>  CHIFFRES');
                const update = grid[i].AS + grid[i].DEUX + grid[i].TROIS + grid[i].QUATRE + grid[i].CINQ + grid[i].SIX;
                let updateTotalChiffre = [...totalChiffre];
                updateTotalChiffre[i] = update;
                setTotalChiffre(updateTotalChiffre);

                // Calcul du bonus //
                let playerBonus = 0
                if (update >= 63) {
                    playerBonus = 35
                }
                let newBonus = [...bonus];
                newBonus[i] = playerBonus;
                setBonus(newBonus);

                // Mettre à jour le total I //
                let updateTotalI = [...totalI];
                updateTotalI[i] = update + playerBonus;
                setTotalI(updateTotalI);
            } else {
                isFinish = false
            }

            ///// Vérifier que toutes les combinaisons sont remplies  /////
            if (grid[i].suite !== ""
                && grid[i].full !== ""
                && grid[i].carre !== ""
                && grid[i].yams !== "") {
                const playerTotalIII = grid[i].full + grid[i].suite + grid[i].carre + grid[i].yams;
                let updateTotalIII = [...totalIII];
                updateTotalIII[i] = playerTotalIII;
                setTotalIII(updateTotalIII);
            } else {
                isFinish = false
            }
        }

        if (isFinish) {
            setGameFinished(true)
        }

    }, [grid])
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///// Calculer le résultat final si la partie est terminée /////
    useEffect(() => {
        console.log('run finish');
        let updatedTotalFinal = [...finalTotal];
        for (let index = 0; index < totalI.length; index++) {
            const totalFinalPlayer = totalI[index] + totalII[index] + totalIII[index];

            console.log('updated I', updatedTotalFinal);

            updatedTotalFinal[index] = totalFinalPlayer;
            console.log('total final pour ce joueur', index, totalFinalPlayer);
            setFinalTotal(updatedTotalFinal)
        }
    }, [gameFinished])


    ///// Passer à la manche suivante /////
    const newRound = () => {
        if (activePlayer === grid.length - 1) {
            setActivePlayer(0);
        } else {
            setActivePlayer(activePlayer + 1);
        };
        setTotal(0);
        setDicesData([]);
        setTotalRolls(0);
        setActualRound(!actualRound);
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
        setActualRound(!actualRound);
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
                newRound();
            }
        }
    }

    ///// Remplir case maximum du joueur /////
    const fillMaxMulti = (i) => {
        if (grid[i].maximum === "") {
            if (activePlayer === i) {
                const update = { maximum: total }
                let updateGrid = { ...grid[i], ...update };
                let newGrid = [...grid];
                newGrid[i] = updateGrid
                setGrid(newGrid);
                newRound();
            }
        }
    }

    ///// Remplir case minimum du joueur /////
    const fillMinMulti = (i) => {
        if (grid[i].minimum === "") {
            if (activePlayer === i) {
                const update = { minimum: total }
                let updateGrid = { ...grid[i], ...update };
                let newGrid = [...grid];
                newGrid[i] = updateGrid
                setGrid(newGrid);
                newRound();
            }
        }
    }

    ///// Remplir la case de la suite /////
    const fillSuiteMulti = (player) => {
        if (grid[player].suite === "") {
            if (player === activePlayer) {
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
                let updatedGrid = { ...grid[player], ...update };
                let newGrid = [...grid];
                newGrid[player] = updatedGrid;
                setGrid(newGrid);
                newRound();
            }
        }
    }

    ///// Remplir la case du full /////
    const fillFullMulti = (player) => {
        if (grid[player].full === "") {
            if (player === activePlayer) {
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
                if (validateTwo === true && validateThree === true) { point = 25 };

                const update = {};
                update.full = point;
                let updatedGrid = { ...grid[player], ...update };
                let newGrid = [...grid];
                newGrid[player] = updatedGrid;
                setGrid(newGrid);
                newRound();
            }
        }
    }

    ///// Remplir la case du carré ou du yams/////
    const fillFigureMulti = (nomCombin, toReach, player) => {
        if (grid[player][nomCombin] === "") {
            if (player === activePlayer) {
                let validate = false;
                const dicesToObject = diceDataToObject();

                for (const property in dicesToObject) {
                    if (dicesToObject[property] >= toReach) {
                        validate = true;
                    }
                }

                let point = 0;
                if (validate) {
                    point = toReach * 10;
                    console.log('CARRE OK');
                }
                const update = {};
                update[nomCombin] = point;
                let updatedGrid = { ...grid[player], ...update };
                let newGrid = [...grid];
                newGrid[player] = updatedGrid;
                setGrid(newGrid);
                newRound();
            }
        }
    }

    ///// Génération des dés /////
    let myThrow = dicesData.map((dice, i) => {
        return <Dice face={dice.value} key={i} id={i} reRoll={toReRoll} toLight={dice.toReRoll} numberOfReRoll={dice.numberOfReRoll}></Dice>
    });

    //////////////////////////////////////////////////////////////////////     Génération cases de la grille    ///////////////////////////////////////////////////////////////////////////
    const caseName = grid.map((elem) => { return (<td>{elem.name}</td>) });

    const caseAs = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(1, i) }}>{elem.AS}</td>) });
    const caseDeux = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(2, i) }}>{elem.DEUX}</td>) });
    const caseTrois = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(3, i) }}>{elem.TROIS}</td>) });
    const caseQuatre = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(4, i) }}>{elem.QUATRE}</td>) });
    const caseCinq = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(5, i) }}>{elem.CINQ}</td>) });
    const caseSix = grid.map((elem, i) => { return (<td onClick={() => { fillNumberMulti(6, i) }}>{elem.SIX}</td>) });

    const caseMaxi = grid.map((elem, i) => { return (<td onClick={() => { fillMaxMulti(i) }}>{elem.maximum}</td>) });
    const caseMini = grid.map((elem, i) => { return (<td onClick={() => { fillMinMulti(i) }}>{elem.minimum}</td>) });

    const caseSuite = grid.map((elem, i) => { return (<td onClick={() => { fillSuiteMulti(i) }}>{elem.suite}</td>) });
    const caseFull = grid.map((elem, i) => { return (<td onClick={() => { fillFullMulti(i) }}>{elem.full}</td>) });
    const caseCarre = grid.map((elem, i) => { return (<td onClick={() => { fillFigureMulti('carre', 4, i) }}>{elem.carre}</td>) });
    const caseYams = grid.map((elem, i) => { return (<td onClick={() => { fillFigureMulti('yams', 5, i) }}>{elem.yams}</td>) });

    const caseTotalChiffre = grid.map((elem, i) => { return (<td>{totalChiffre[i]}</td>) });
    const caseBonus = grid.map((elem, i) => { return (<td>{bonus[i]}</td>) });
    const caseTotalI = grid.map((elem, i) => { return (<td>{totalI[i]}</td>) });
    const caseTotalII = grid.map((elem, i) => { return (<td>{totalII[i]}</td>) });
    const caseTotalIII = grid.map((elem, i) => { return (<td>{totalIII[i]}</td>) });
    const caseFinalTotal = grid.map((elem, i) => { return (<td>{finalTotal[i]}</td>) });

    ///// Rendu
    return (
        <div className="App"><div className="grille">
            {gameFinished ? <Redirect to='/' /> : null}
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
                        {caseTotalChiffre}
                    </tr>
                    <tr>
                        <td>BONUS</td>
                        {caseBonus}
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>TOTAL I</td>
                        {caseTotalI}
                    </tr>
                    <tr>
                        <td>Maximum</td>
                        {caseMaxi}
                    </tr>
                    <tr>
                        <td>Minimum</td>
                        {caseMini}
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>TOTAL II</td>
                        {caseTotalII}
                    </tr>
                    <tr>
                        <td>SUITE</td>
                        {caseSuite}
                    </tr>
                    <tr>
                        <td>FULL</td>
                        {caseFull}
                    </tr>
                    <tr>
                        <td>CARRE</td>
                        {caseCarre}
                    </tr>
                    <tr>
                        <td>YAM</td>
                        {caseYams}
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>TOTAL III</td>
                        {caseTotalIII}
                    </tr>
                    <tr>
                        <td style={{ color: "red" }}>SCORE FINAL</td>
                        {caseFinalTotal}
                    </tr>

                </tbody>
            </Table>
        </div>
            <div className="command">
                <h1>{grid[activePlayer].name}</h1>

                <div className="playingTable">

                    {myThrow}
                </div>
                <div>
                    {actualRound ?
                        <Button variant="outline-success" className="button" onClick={() => { reRoll() }}>Re-Roll</Button> :
                        <Button variant="outline-success" className="button" onClick={() => { rollDices(5) }}>Roll</Button>

                    }
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