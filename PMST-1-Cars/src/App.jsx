import { useState } from 'react'
import './App.css'
import Cars from './Cars'

const initialCars = [
  { id: 1, brand: 'Toyota', model: 'Fortuner', price: '20,000' },
  { id: 2, brand: 'Mahindra', model: 'Scorpio', price: '22,000' },
  { id: 3, brand: 'Maruti', model: 'Alto 800', price: '9,000' }
]

function App() {
  const [cars, setCars] = useState(initialCars)

  function removeCar(id) {
    setCars(prev => prev.filter(car => car.id !== id))
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '1rem auto', maxWidth: 620 }}>
      {cars.map(car => (
        <li
          key={car.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #000',
            padding: '0.75rem 1rem',
            margin: '0.5rem 0',
            borderRadius: 4
          }}
        >
          <Cars car={car} />
          <button
            onClick={() => removeCar(car.id)}
            style={{ cursor: 'pointer' }}
          >
            Remove
          </button>
        </li>
      ))}
      {cars.length === 0 && (
        <li style={{ border: '1px solid #ccc', padding: '0.75rem 1rem', marginTop: '0.5rem', borderRadius: 4 }}>
          No cars available.
        </li>
      )}
    </ul>
  )
}

export default App
