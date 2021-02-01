const handleRates = (ratesData) => {
  const currencyList = document.querySelector('#currency-list');

  const entries = Object.entries(ratesData.rates);
  
  entries.forEach((array) => {
    const [ currency, rate ] = array;

    const formattedRate = Math.round(rate * 100) / 100;
    
    const li = document.createElement('li');
    li.innerHTML = `<strong>${currency}:</strong> ${formattedRate}`

    currencyList.appendChild(li);
  });
}

const handleRatesBTC = (ratesData) => {
  const currencyList = document.querySelector('#currency-list');
  const entries = Object.entries(ratesData.bpi);
  
  entries.forEach((array) => {
    const [ currency, rate ] = array;

    const formattedRate = Math.round(rate.rate_float * 100) / 100;
    
    const li = document.createElement('li');
    li.innerHTML = `<strong>${currency}:</strong> ${formattedRate}`

    currencyList.appendChild(li);
  });
}

const fetchBTC = () => {
  const endpointBTC = 'https://api.coindesk.com/v1/bpi/currentprice.json'
  
  fetch(endpointBTC)
    .then((response) => response.json())
    .then((object) => {
      handleRatesBTC(object)
      sortCurrencyList()
    })
    .catch((error) => {
      window.alert(error)
    })
}

const fetchCurrency = (currency) => {
  if (currency === 'BTC') {
    fetchBTC();
  } else {
    const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;
  
    fetch(endpoint)
      .then((response) => response.json())
      .then((object) => { 
        if (object.error) {
          throw new Error(object.error);
        }
        
        handleRates(object);
        sortCurrencyList();
      })
      .catch((error) => {
        window.alert(error);
      });
  }
}

const fetchCurrencyAsyncAwait = async (currency) => {
  // SE eu vou usar await dentro de uma função, então
  // a assinatura da função TEM QUE TER a palavra async

  const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    }

    handleRates(object);
    sortCurrencyList();
  } catch (error) {
    window.alert(error);
  } 
}

const clearList = () => {
  const currencyList = document.querySelector('#currency-list');
  currencyList.innerHTML = '';
}

const sortCurrencyList = () => {
  const currencyList = document.querySelectorAll('#currency-list li')
  const currencyNamesList = Object.entries(currencyList)
    .map((currency) => {
      return currency[1].innerHTML
  })

  const sortedCurrencyList = currencyNamesList.sort()

  clearList();

  for (let i of sortedCurrencyList) {
    const currencyList = document.querySelector('#currency-list');
    const li = document.createElement('li')

    li.innerHTML = i

    currencyList.appendChild(li)
  }
}

const handleSearchEvent = () => {
  const searchInput = document.querySelector('#currency-input');
  const currency = searchInput.value.toUpperCase();

  clearList();
  fetchCurrency(currency);
}

const setupEvents = () => {
  const searchButton = document.querySelector('#search-button');
  const searchInput = document.querySelector('#currency-input');

  searchButton.addEventListener('click', handleSearchEvent);
  searchInput.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      handleSearchEvent()
    }
  })
}

window.onload = () => {
  setupEvents();
}
