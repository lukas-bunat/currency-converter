import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Search from './components/search';
import Result from './components/result';

function App () {
  const [ loading, setLoading ] = useState(true);
  const [ currencyTable, setCurrencyTable ] = useState([]);
  const [ filter, setFilter ] = useState();

  // https://stackoverflow.com/questions/36631762/returning-html-with-fetch
  function parseDataIntoArray (html) {
    // Initialize the DOM parser
    var parser = new DOMParser();

    // Parse the HTML text
    var doc = parser.parseFromString(html, "text/html");

    // table with exchange rates
    const exchnages = doc.querySelector('.currency-table');
    const countriesRate = exchnages.querySelectorAll('tr');

    var newCurrencyTable = [];

    // parse single row
    countriesRate.forEach(el => {
      // split the row
      const rowCols = el.querySelectorAll('td');

      if (rowCols.length != 0) {
        // assign
        const countryName = rowCols[ 0 ].innerText;
        const currencyCode = rowCols[ 3 ].innerText;
        const exchangeRate = rowCols[ 4 ].innerText;
        const exchangeAmount = rowCols[ 2 ].innerText;

        const row = {
          code: currencyCode,
          country: countryName,
          amount: exchangeAmount,
          rate: exchangeRate
        };
        newCurrencyTable.push(row);
      }
    });
    // state has to updated ater all iterations have finished
    setCurrencyTable(newCurrencyTable);
    // fetching has finished and data are parsed
    setLoading(false);
  }

  useEffect(() => {
    // async function has to be called separetly since useEffect cant return a promise
    async function fetchExchnagerates () {

      const date = "18.05.2020";
      const url = `https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/index.html?date=${ date }`;

      // cors anywhere proxy
      const proxy = "https://cors-anywhere.herokuapp.com/";

      const res = await fetch(`${ proxy }${ url }`)
        .catch((err) => {
          console.error(err);
        });
      const data = await res.text();

      // console.log(data);

      parseDataIntoArray(data);
    };

    fetchExchnagerates();
  }, []); // use only on mount


  return (
    <div className="App">
      {/* header */ }
      <header><h1>Currency converter</h1></header>
      {/* main */ }
      <main>
        {/* search */ }
        {/* getFilter recive data from child and here in parent component set state of 'filter' */ }
        <Search getFilter={ (x) => { console.log(x); setFilter(x); } } />
        {/* res */ }
        { loading
          ? <h2>Your data are being loaded. Please wait a moment. ⏳</h2>
          : <Result data={ currencyTable } filter={ filter } />
        }
      </main>
      <footer></footer>
    </div>
  );
}

export default App;