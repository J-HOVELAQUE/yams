import React, { useState } from 'react';
import '../App.css';
// import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Redirect } from 'react-router-dom';

// import { Dice } from './dice.js';

export function Home(props) {

    const [nameGrid, setNameGrid] = useState('');
    const [startGame, setStartGame] = useState(false);
    const [newGameUrl, setNewGameUrl] = useState('');

    const startNewGame = (name) => {
        console.log(name);
        setStartGame(true);
        setNewGameUrl(`/new-game/${nameGrid}`)
    }

    return (
        <div className="home">
            {startGame ? <Redirect to={newGameUrl} /> : ""}
            <h1>HOME</h1>
            <Link to="/new-game/">Nouvelle partie</Link>
            {/* <Link to="/load-game/julien">Charger dernière partie</Link> */}
            <input

                onChange={(e) => setNameGrid(e.target.value)}

                value={nameGrid}

            />
            <button onClick={() => { startNewGame(nameGrid) }}>New game</button>
        </div>
    )
}
