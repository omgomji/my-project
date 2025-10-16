import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch from backend API
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        setProducts(res.data || [])
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load products')
        setLoading(false)
        // optional: console for dev
        console.error('Fetch error:', err?.message)
      })
  }, [])

  return (
    <div className="wrapper">
      <h1 className="title">Product List</h1>
      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul className="grid">
          {products.map((p) => (
            <li key={p.id} className="card">
              <h3 className="name">{p.name}</h3>
              <p className="price">Price: ${p.price}</p>
              <button className="buyBtn" type="button">Buy Now</button>
            </li>
          ))}
          {products.length === 0 && (
            <li className="empty">No products found.</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default App
