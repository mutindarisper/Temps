import { Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import Signup from './components/UserManagement/Signup'
import Login from './components/UserManagement/Login'
import './App.css'

function App() {
 

  return (
    <>
    <Routes>
      <Route  path="/" element={<Map />} />
      <Route  path="/signup" element={<Signup />} />
      <Route  path="/login" element={<Login />} />

      
    </Routes>
   
   
    </>
  )
}

export default App
