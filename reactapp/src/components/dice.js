import React, { useState } from 'react';
import '../App.css';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faDiceFour,
    faDiceOne,
    faDiceTwo,
    faDiceThree,
    faDiceFive,
    faDiceSix
} from '@fortawesome/free-solid-svg-icons';

const faces = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix]


export function Dice(props) {

    const [toReRollThisDice, setToReRollThisDice] = useState(false);
    let diceStyle;


    const toReRoll = (key) => {
        setToReRollThisDice(!toReRollThisDice);
        props.reRoll(key);
    }

    if (props.toLight) {
        diceStyle = {
            height: "60px",
            width: "60px",
            // border: "1px solid solid",
            // backgroundColor: "yellow",
            // margin: "5px",
            border: "2px solid red"
        };
    }
    if (!props.toLight) {
        diceStyle = {
            height: "60px",
            width: "60px",
            // border: "1px solid solid",
            // backgroundColor: "yellow",
            // margin: "5px",
            border: "none"
        };
    }

    let faceIcon = <FontAwesomeIcon icon={faces[props.face - 1]} className="dice" style={diceStyle} onClick={() => toReRoll(props.id)} />


    return (
        <div  >
            {faceIcon}
            <p>Ce dé a été jeté {props.numberOfReRoll} fois</p>
        </div>
    )
}