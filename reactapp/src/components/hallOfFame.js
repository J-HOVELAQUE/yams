import React, { useEffect, useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';



function HallOfFame(props) {

    const [gotoHome, setGotoHome] = useState(false);
    const [scores, setScores] = useState([]);

    useEffect(() => {
        async function getScore() {
            const rawResponse = await fetch('/get-score');
            const responsePretty = await rawResponse.json();
            const response = responsePretty.grid

            for (let i = 0; i < response.length; i++) {
                /// Ajouter des zéro sur les champ null ///
                for (const key in response[i]) {
                    console.log(response[i][key]);
                    if (response[i][key] === null) {
                        response[i][key] = 0
                    }
                }

                /// Calcul des totaux
                response[i].totalChiffre = response[i].AS + response[i].DEUX + response[i].TROIS + response[i].QUATRE + response[i].CINQ + response[i].SIX;
                if (response[i].totalChiffre >= 63) {
                    response[i].bonus = 35
                } else {
                    response[i].bonus = 0
                }
                response[i].totalI = response[i].totalChiffre + response[i].bonus;
                response[i].totalII = response[i].maximum - response[i].minimum;
                response[i].totalIII = response[i].suite + response[i].full + response[i].carre + response[i].yams;
                response[i].totalFinal = response[i].totalI + response[i].totalII + response[i].totalIII
            }

            ///// Trier les scores avec le résultat final /////
            const sortedScores = response.sort(function (a, b) {
                return b.totalFinal - a.totalFinal;
            });

            setScores(sortedScores);

        };
        getScore();
    }, []);

    const towardHome = () => {
        setGotoHome(true)
    }

    ///// Génération des cartes /////
    const scoreCards = scores.map((grid) => {

        return (
            <div className="formulaire">
                <p style={{ color: "red" }}>Nom : {grid.name}</p>
                <p>AS : {grid.AS}</p>
                <p>DEUX : {grid.DEUX}</p>
                <p>TROIS : {grid.TROIS}</p>
                <p>QUATRE : {grid.QUATRE}</p>
                <p>CINQ : {grid.CINQ}</p>
                <p>SIX : {grid.SIX}</p>
                <p>Bonus : {grid.bonus}</p>
                <p style={{ color: "red" }}>Total I : {grid.totalI}</p>
                <p>Maximum : {grid.maximum}</p>
                <p>Minimum : {grid.minimum}</p>
                <p style={{ color: "red" }}>Total II : {grid.totalII}</p>
                <p>Full : {grid.full}</p>
                <p>Suite : {grid.suite}</p>
                <p>Carré : {grid.carre}</p>
                <p>Yam : {grid.yams}</p>
                <p style={{ color: "red" }}>Total III : {grid.totalIII}</p>
                <p style={{ color: "red" }}>Total final : {grid.totalFinal}</p>
            </div>
        )
    })

    return (
        <div className="hallOfFame">
            {gotoHome ? <Redirect to='/' /> : null}
            {scoreCards}
            <Button variant="outline-success" className="button" onClick={() => { towardHome() }}>Home</Button>

        </div>
    )
};

export default HallOfFame;