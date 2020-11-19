// eslint-disable-next-line import/no-anonymous-default-export
export default function (playerNames = [], action) {

    if (action.type === 'recordPlayerNames') {
        let grilles = [];
        for (let i = 0; i < action.playerNames.length; i++) {
            grilles.push({
                name: action.playerNames[i],
                AS: "",
                DEUX: "",
                TROIS: "",
                QUATRE: "",
                CINQ: "",
                SIX: "",
                minimum: "",
                maximum: "",
                suite: "",
                full: "",
                carre: "",
                yams: ""
            })
        };

        return grilles
    } else {
        return playerNames
    }
}