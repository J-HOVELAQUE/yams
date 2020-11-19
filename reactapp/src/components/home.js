import React, { useState, useEffect } from 'react';
import '../App.css';
// import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';

function Home(props) {

    const [startGame, setStartGame] = useState(false);
    const [numberPlayer, setNumberPlayer] = useState(1);
    const [playerNames, setPlayerNames] = useState(['']);

    const startNewGame = () => {
        setStartGame(true);
        props.recordPlayerNames(playerNames);
    }

    let inputPlayerName = [];

    ///// Mo^difier le nom des joueurs en entrée /////
    const modifyName = (e, key) => {
        let newPlayerNames = [...playerNames];
        newPlayerNames[key] = e.target.value;
        setPlayerNames(newPlayerNames)
    }

    ///// Génération des champs d'entrée pour les noms des joueurs /////
    for (let i = 0; i < numberPlayer; i++) {
        inputPlayerName.push(<input
            placeholder={`player ${i + 1}`}
            onChange={(e) => modifyName(e, i)}
            value={playerNames[i]}
        />)
    }

    const addPlayer = () => {
        setNumberPlayer(numberPlayer + 1);
        let newPlayerNames = [...playerNames];
        newPlayerNames.push('');
        setPlayerNames(newPlayerNames)
    }

    const removePlayer = () => {
        setNumberPlayer(numberPlayer - 1);
        let newPlayerNames = [...playerNames];
        newPlayerNames.pop();
        setPlayerNames(newPlayerNames)
    }

    return (
        <div className="home">

            {startGame ? <Redirect to='/new-game' /> : null}


            <button onClick={() => { removePlayer() }}>Remove Player</button>
            <button onClick={() => { addPlayer() }}>Add Player</button>
            <button onClick={() => { startNewGame() }}>New game</button>
            <h1>Nom des joueurs</h1>
            {inputPlayerName}
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        recordPlayerNames: function (playerNames) {
            dispatch({
                type: 'recordPlayerNames',
                playerNames: playerNames
            })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Home);