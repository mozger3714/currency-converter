import React, { useEffect, useRef, useState } from 'react';
import { Block } from './components/Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('PLN')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [fromPrice, setFromPrice] = useState(0)
  const [toPrice, setToPrice] = useState(1)

  // const [rates, setRates] = useState({}) //works staticaly, when the page is rendered, this doesn't change price, cuz changes of states in useState are async, so useRef is better
  const rates = useRef({})

  useEffect(()=>{
    //this api requires no App id
    fetch('https://cdn.cur.su/api/latest.json')
    .then(res => res.json())
    .then((json)=>{
      rates.current = json.rates
      onChangePriceFrom(1)
    }).catch(err=>{
      console.warn(err)
    }).finally()
  }, [])

  //to calculate value when input value
  const onChangePriceFrom = (value) => {   
    const _resultFrom = (value / rates.current[fromCurrency]) * rates.current[toCurrency]
    setToPrice(_resultFrom.toFixed(3))
    setFromPrice(value)
  }
  const onChangePriceTo = (value) => {
    const _resultTo = (rates.current[fromCurrency] / rates.current[toCurrency]) * value
    setFromPrice(_resultTo.toFixed(3))
    setToPrice(value)
  }

  //to change values when change currency
  useEffect(()=> {
      onChangePriceFrom(fromPrice)
  }, [fromCurrency])

  useEffect(()=> {
    onChangePriceTo(toPrice)
  }, [toCurrency])


  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeCurrency={setFromCurrency} 
        onChangeValue={onChangePriceFrom}
      />
      <Block 
      value={toPrice} 
      currency={toCurrency} 
      onChangeCurrency={setToCurrency} 
      onChangeValue={onChangePriceTo}
      />
    </div>
  );
}

export default App;
