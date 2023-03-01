"use client"
import React, {useEffect, useState} from 'react'
import {Bar, Pie} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'
import TrialComponent from '../../components/TrialComponent';


function Page() {
  const [data, setData] = useState({});
  const [item, setItem] = useState([]);
  const [value, setValue] = useState([]);
  const [errMsg, setErrMsg] = useState('');



  useEffect(()=> {
    const data = {
      labels: item,
      datasets: [{
        label: 'items',
        data: value,
        backgroundColor: ['red', 'blue', 'green', 'yellow']
      }]
    }
    setData(data)
  }, [item, value])


  const convertCurrency = async(amount)=> {
    try {
      const res = await fetch(`https://api.exchangerate.host/convert?amount=${amount}&from=USD&to=EUR`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'applications/json',
        },
      });
      const response = await res.json();
      if(response.success) {
        setValue([...value, response.result])
      }
    } catch (error) {
      console.log(error)
    }
  }

  
  const clicked = (e)=> {
    e.preventDefault();
    if(item.length === value.length) {
      setErrMsg('choose an item')
    }else {
      setErrMsg('')
      convertCurrency(e.target[0].value)
    }
  }

  const buttons = (e)=> {
    if(item.includes(e.target.textContent)) {
      setErrMsg('choose another item');
    }else {
      setErrMsg('')
      setItem([...item, e.target.textContent]);
    }
  }
  
  return (
    <div style={{width: '80%', margin: 'auto'}}>
      <TrialComponent buttons={buttons} click={clicked} />
      {errMsg !== '' && <h6 className='text-danger'>{errMsg}</h6>}
      {value.length > 0 && <div style={{width: '300px', marginTop: '30px'}}>
        <Pie data={data} />
      </div>}
    </div>
  )
}

export default Page