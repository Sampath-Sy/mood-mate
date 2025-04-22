import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Moodmate.css";
import jsPDF from 'jspdf';
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import MoodCard from "./moodcard/MoodCard";
library.add(faSun);

export default function Moodmate() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState(new Date());
  const [mood, setMood] = useState({
    emoji: "",
    text: "",
    date: "",
    temperature: "",
  });
  const [formError, setFormError] = useState("");
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError(
            "Unable to retrieve location. Please enable location services."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const feathWeather = async () => {
    if (location.latitude && location.longitude) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=a22aaef078308c165a402630ac6fa3a7`
        );
        const data = await response.json();
        setWeather(data?.main);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };

  const convertToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  const handleSave = () => {
    if (!mood.emoji) {
      setFormError("Please select an emoji.");
      return;
    }
    if (!mood.text.trim()) {
      setFormError("Please write a note.");
      return;
    }

    setFormError("");

    const savedMood = {
      emoji: mood.emoji,
      text: mood.text,
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      temperature: weather?.temp
        ? `${convertToCelsius(weather.temp)}°C`
        : "Temperature not available",
    };

    const updatedNotes = [...notes, savedMood];
    setNotes(updatedNotes);
    localStorage.setItem("moodNotes", JSON.stringify(updatedNotes));

    setMood({ emoji: "", text: "" });
    alert("Mood saved successfully!");
  };
  const getBackgroundColor = () => {
    switch (mood.emoji) {
      case "😊":
        return "#FFD700";
      case "😐":
        return "#D3D3D3";
      case "😢":
        return "#87CEEB";
      case "😡":
        return "#FF6347";
      case "😄":
        return "#90EE90";
      default:
        return "#DDA580";
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Mood Notes', 10, 10);
  
    notes.forEach((note, index) => {
      const y = 20 + index * 10;
      doc.text(`Date: ${note.date}`, 10, y);
      doc.text(`Temperature: ${note.temperature}`, 60, y);
      
      doc.text(`Note: ${note.text}`, 140, y);
    });
  
    doc.save('mood_notes.pdf');
  };

  useEffect(() => {
    const storedNotes = localStorage.getItem("moodNotes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    feathWeather();
  }, [location]);

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <main
      className="moodmate"
      style={{ background: getBackgroundColor() }}
    >
      <div className="header-container">
        <h1 className="header">MoodMate</h1>
        <button onClick={() => setShowNotes(!showNotes)}>
          {showNotes ? "Back to Mood Tracker" : "All Notes"}
        </button>
        <div className="weather-container">
          <p>
            {weather?.temp ? (
              <>
                {convertToCelsius(weather.temp) >= 30 ? "☀️" : null}
                {convertToCelsius(weather.temp) >= 20 &&
                convertToCelsius(weather.temp) < 30
                  ? "🌤️"
                  : null}
                {convertToCelsius(weather.temp) >= 10 &&
                convertToCelsius(weather.temp) < 20
                  ? "☁️"
                  : null}
                {convertToCelsius(weather.temp) < 10 ? "❄️" : null}
                {` ${convertToCelsius(weather.temp)}°C`}
              </>
            ) : (
              "Loading..."
            )}
          </p>
        </div>
        <button className="export-btn" onClick={exportToPDF}>
            Export to PDF
        </button>
      </div>

      {!showNotes ? (
        <div className="mood-calendar__container">
          <div className="mood-container">
            <div className="date-emoji__container">
              <h1 className="date">
                {date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h1>

              <p className="mood-question__text">How are you feeling today?</p>
              <div className="mood-buttons">
                <button
                  className={`emoji ${mood.emoji === "😊" ? "selected" : ""}`}
                  onClick={() => setMood({ ...mood, emoji: "😊" })}
                >
                  😊
                </button>
                <button
                  className={`emoji ${mood.emoji === "😐" ? "selected" : ""}`}
                  onClick={() => setMood({ ...mood, emoji: "😐" })}
                >
                  😐
                </button>
                <button
                  className={`emoji ${mood.emoji === "😢" ? "selected" : ""}`}
                  onClick={() => setMood({ ...mood, emoji: "😢" })}
                >
                  😢
                </button>
                <button
                  className={`emoji ${mood.emoji === "😡" ? "selected" : ""}`}
                  onClick={() => setMood({ ...mood, emoji: "😡" })}
                >
                  😡
                </button>
                <button
                  className={`emoji ${mood.emoji === "😄" ? "selected" : ""}`}
                  onClick={() => setMood({ ...mood, emoji: "😄" })}
                >
                  😄
                </button>
              </div>

              <textarea
                className="mood-textarea"
                placeholder="Write about your day..."
                value={mood.text}
                onChange={(e) => setMood({ ...mood, text: e.target.value })}
              ></textarea>
              {formError && <p className="error">{formError}</p>}
              <button className="note-sbt__btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
          <div className="calender">
            <Calendar onChange={setDate} value={date} />
          </div>
        </div>
      ) : (
        <div className="notes-container">
          <h2 className="all-notes__header">All Notes</h2>
          <div className="notes-list">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <MoodCard
                  key={index}
                  emoji={note.emoji}
                  text={note.text}
                  date={note.date}
                  temperature={note.temperature}
                />
              ))
            ) : (
              <p>No notes saved yet.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
