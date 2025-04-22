import React from "react";
import "./MoodCard.css";

export default function MoodCard({ emoji, text, date, temparature } = props) {
  return (
    <div className="mood-card">
      <div className="mood-card__emoji">{emoji}</div>
      <div className="mood-card__text-container">
      <div className="mood-card__text">{text}</div>
      <div className="mood-card__date">{date}</div>


      </div>
      
      <div className="mood-card__temparature">{temparature}</div>
    </div>
  );
}
