// TODO Use the stateful way of debouncing

import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

// Don't change the date object, make a NEW one
const addHours = (date, h) => {
  const date2 = new Date();
  date2.setTime(date.getTime() + h * 60 * 60 * 1000);
  return date2;
};

const numberOfCards = 3;

function App() {
  const [timeState, setTimeState] = useState(new Date());

  const intToString = (number) => {
    let string;
    if (number < 0) {
      string = "-" + Math.abs(Math.ceil(number)).toString().padStart(2, "0");
    } else {
      string = "+" + Math.floor(number).toString().padStart(2, "0");
    }

    return string + ":" + ((60 * number) % 1).toString().padStart(2, "0");
  };

  // timezone is an integer now, need to reformat how timezone is displayed
  const [countries, setCountries] = useState([
    { name: "Ghana", timezone: 0 },
    { name: "United States (Hawaii)", timezone: -10 },
    { name: "Marquesas Islands", timezone: -9.5 },
  ]);

  // useEffect for keeping track of time and incrementing with seconds
  useEffect(() => {
    setInterval(() => {
      setTimeState(new Date());
    }, 1000);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChangeDebounce = (timeDelay) => {
    // NOTE that this is being called everytime the screen re-renders- is this normal?
    let timer;

    return function (event) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleChange(event);
      }, timeDelay);
    };
  };

  const handleChange = async (event) => {
    const search = event.target.value;
    const res = await fetch(`http://localhost:3500/${search}`, {
      method: "GET",
    });
    const result = await res.json();

    const newCountries = [];
    for (let i = 0; i < numberOfCards; i++) {
      if (i < result.length) {
        newCountries[i] = {
          name: result[i].name,
          timezone: result[i].timezone,
        };
      } else {
        newCountries[i] = {
          name: "",
          timezone: 0,
        };
      }
    }
    setCountries(newCountries);
  };

  const getTimeCard = (country, idx) => {
    return (
      <div
        className="resultCard"
        style={{ opacity: `${country.name === "" ? "0" : "1"}` }}
        key={idx}
      >
        <div className="locationTime">
          <h2 className="country">{country.name}</h2>
          <h2 className="time">
            {addHours(timeState, country.timezone).toLocaleTimeString("en-GB")}
          </h2>
        </div>
        <div className="timezone">{`GMT${intToString(country.timezone)}`}</div>
      </div>
    );
  };

  const cardsJSX = countries.map((country, idx) => getTimeCard(country, idx));

  return (
    <div className="App">
      <div className="container">
        <form method="get" onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="Search"
              onChange={handleChangeDebounce(500)}
            ></input>
          </label>
        </form>
        {cardsJSX}
      </div>
    </div>
  );
}

export default App;
