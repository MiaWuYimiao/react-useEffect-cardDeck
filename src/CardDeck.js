import React, {useState, useEffect, useRef} from "react";
import Card from './Card';
import axios from "axios";
import './CardDeck.css';

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

const CardDeck = () => {
    const [cards, setCards] = useState([]);
    const [remaining, setRemaining] = useState(52);
    const [deckId, setDeckId] = useState("");
    const timerId = useRef();
    const [drawingState, setDrawingState] = useState(false);

    useEffect(function fetchDeckWhenMounted() {
        console.log("call fetchdeck")
        async function fetchDeck() {
            const deckResult = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeckId(deckResult.data.deck_id);
            console.log(deckId);
        }
        fetchDeck();
    }, []);

    useEffect(function startOrStopDrawing() {
        console.log("call starorstopdrawing()")
        async function getCard() {
            console.log("getcard", remaining);
            try {
                if(remaining === 0) {
                    setDrawingState(false);
                    throw new Error("no cards remaining!");
                }
                const cardResult = await axios.get(`${API_BASE_URL}/${deckId}/draw/`)
                const cardImg = cardResult.data.cards[0].image;
                setRemaining(cardResult.data.remaining);
                setCards(cards => ([...cards, cardImg]));
            } catch (err) {
                alert(err);
            }

        };

        if(remaining > 0 && drawingState){
            timerId.current = setInterval(async () => {
                await getCard();
              }, 1000);
        }

        return function cleanUpClearTimer() {
            clearInterval(timerId.current);
        };

    }, [drawingState]);

    const handleClick = () => {
        setDrawingState(drawingState => !drawingState);
    }

    return (
        <div>
            <button style={{margin:"30px"}} onClick={handleClick} >
                {drawingState? "Stop Drawing" : "Start Drawing"}
            </button>
            <div className="CardDeck-cards">
                {cards.map((card, id) => <Card key={id} source={card} />)}
            </div>
        </div>
    )
}

export default CardDeck;