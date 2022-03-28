// Works for now, but it does not update if the string is empty...

import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

// Don't change the date object, make a NEW one
const addHours = (date, h) => {
  const date2 = new Date();
  date2.setTime(date.getTime() + h * 60 * 60 * 1000);
  return date2;
};

// A helper method for converting from a number
const numberToString = (number) => {
  let string;
  if (number < 0) {
    string = "-" + Math.abs(Math.ceil(number)).toString().padStart(2, "0");
  } else {
    string = "+" + Math.floor(number).toString().padStart(2, "0");
  }

  return string + ":" + ((60 * number) % 1).toString().padStart(2, "0");
};

const numberOfCards = 3;

// Hook that deals calls setDebouncedValue ONLY when the delay has passed.
// If value has changed before the timeout has finished, then the return clears the timeout,
// cancelling the setter.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

function App() {
  const [timeState, setTimeState] = useState(new Date());

  // useEffect for keeping track of time and incrementing with seconds
  useEffect(() => {
    setInterval(() => {
      setTimeState(new Date());
    }, 1000);
  }, []);

  // timezone is a number now, need to reformat how timezone is displayed
  const [countries, setCountries] = useState([
    { name: "Ghana", timezone: 0 },
    { name: "United States (Hawaii)", timezone: -10 },
    { name: "Marquesas Islands", timezone: -9.5 },
  ]);

  // search term is now a state
  const [searchTerm, setSearchTerm] = useState("");
  // call useDebounce hook and assign here. searchTerm's reference is passed here
  // so if the value of searchTerm changes, then whatever we call it inside this hook
  // will also change.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // this effect is only invoked if the search term has changed, and it only changes, once the
  // timer has passed.
  useEffect(() => {
    fetchResults();
  }, [debouncedSearchTerm]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchResults = async () => {
    const res = await fetch(`http://localhost:3500/${searchTerm}`, {
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
        <div className="timezone">{`GMT${numberToString(
          country.timezone
        )}`}</div>
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
              onChange={handleChange}
            ></input>
          </label>
        </form>
        {cardsJSX}
      </div>
    </div>
  );
}

export default App;
