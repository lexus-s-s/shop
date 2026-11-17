import { useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error'

function App() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function checkServ() {

    setStatus('loading')
    setError(null)

    try {
      const response = await fetch("http://localhost:3000/api/health")
      if (!response.ok) {
        throw new Error('Сервер ответил ошибкой: ' + response.status)
      }
      const json: HealthResponse = await response.json()
      setData(json)
      setStatus("success")
    } catch (e) {
      console.error(e);
      setStatus('error')
      setError(e instanceof Error ? e.message : 'неизвестная Ошибка')
    }
  }



  return (
    <>
      <button onClick={checkServ} disabled={status === 'loading'}>
        Check
      </button>
      {status === 'loading' && <p>Загрузка...</p>}
      {status === 'error' && <p>Ошибка: {error}</p>}
      {data && <p>{data.status}</p>}

    </>
  )
}

export default App
