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
  const [offset, setOffset] = useState(new Array(numberOfCards).fill(0));

  // useEffect for keeping track of time and incrementing with seconds
  useEffect(() => {
    setInterval(() => {
      setTimeState(new Date());
    }, 1000);
  }, []);

  // initial selection
  const [country, setCountry] = useState(
    new Array(numberOfCards).fill({ name: "Ghana", timezone: "+00:00" })
  );

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChangeDebounce = (timeDelay) => {
    // NOTE that this is being called everytime the screen re-renders- is this normal?
    let timer;

    return function (event) {
      console.log("returned func being called");
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(event)
        handleChange(event);
      }, timeDelay);
    };
  };

  const handleChange = async (event) => {
    console.log("SUBITTING REQUEST TO API");

    const search = event.target.value;
    const res = await fetch(`http://localhost:3500/${search}`, {
      method: "GET",
    });
    const result = await res.json();

    const newCountry = [];
    const newOffset = [];
    for (let i = 0; i < numberOfCards; i++) {
      if (i < result.length) {
        newCountry[i] = result[i];
        // offset is hours in integers (including minutes)
        const currentOffset = result[i].timezone;
        newOffset[i] =
          parseInt(currentOffset.slice(0, 3)) +
          parseInt(currentOffset.slice(4, 6)) / 60.0;
      } else {
        newCountry[i] = {
          name: "",
          timezone: "",
        };
        newOffset[i] = 0;
      }
    }
    setCountry(newCountry);
    setOffset(newOffset);
  };

  const getTimeCard = (idx) => {
    return (
      <div
        className="resultCard"
        style={{ opacity: `${country[idx].name === "" ? "0" : "1"}` }}
        key={idx}
      >
        <div className="locationTime">
          <h2 className="country">{country[idx].name}</h2>
          <h2 className="time">
            {addHours(timeState, offset[idx]).toLocaleTimeString("en-GB")}
            {/*{timeState.toLocaleTimeString("en-GB")}*/}
          </h2>
        </div>
        <div className="timezone">{`GMT${country[idx].timezone}`}</div>
      </div>
    );
  };

  const cardsJSX = offset.map((el, i) => getTimeCard(i));

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
