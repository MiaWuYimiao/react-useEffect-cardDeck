import React from "react";
import './Card.css';

const Card = ({source}) => {
    const angle = Math.random() * 90 - 45;
    const transform = `rotate(${angle}deg)`;
    return (
        <img style={{ transform }} className="Card-image" src={source} />
    )
}

export default Card;