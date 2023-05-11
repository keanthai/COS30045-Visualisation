import { useState } from 'react'
import classNames from 'classnames'
import BarChart from '../app/component/BarChart'

export default function Home() {

  const [dataState, setDataState] = useState("income")


  return (
    <div className=' mx-10 my-5 space-y-3'>
      <h1 className=' text-3xl font-bold'>Global Issues of Migration</h1>
      <h3>Total people  by Origin and destination</h3>


      <button className={classNames(dataState == "income" ? "bg-blue-700 text-white":
       "bg-white text-blue-700 border-2 border-blue-700", " px-6 py-3 rounded-lg mx-2 shadow-md")}
      onClick={()=> setDataState("income")}
      >Income Groups</button>
      <button className={classNames(dataState == "region" ? "bg-blue-700 text-white":
       "bg-white text-blue-700 border-2 border-blue-700", " px-6 py-3 rounded-lg mx-2 shadow-md")}
      onClick={()=> setDataState("region")}>Geographic Regions</button>

      <BarChart/>

      <form onSubmit={checkLogin}>

      </form>

    </div>
  )
}
