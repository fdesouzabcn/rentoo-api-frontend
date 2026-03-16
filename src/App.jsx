import { login } from './services/authService'

function App() {
  async function handleVerify() {
    try {
      const result = await login('owner1@rentoo.com', 'password')
      console.log('LOGIN RESPONSE SHAPE:', result)
      console.log('  result.data:', result.data)
      console.log('  result.token:', result.token)
      console.log('  result.data.id:', result.data?.id)
    } catch (error) {
      console.error('LOGIN FAILED:', error)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Session 2 — API Verification</h1>
      <button onClick={handleVerify}>
        Test login (check console)
      </button>
    </div>
  )
}

export default App