import { useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string;
};

function App() {
  const [data, setData] = useState<HealthResponse | null>(null);

  async function checkServ() {
    const response = await fetch("http://localhost:3000/api/health")
    const json = await response.json()
    setData(json)
  }



  return (
    <>
      <button onClick={checkServ}>
        Check
      </button>
      {data && <p>{data.status}</p>}
    </>
  )
}

export default App
