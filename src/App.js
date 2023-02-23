import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Startup from './pages/Startup';
import Stories from './pages/Stories';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const authToken = cookies.AuthToken
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {authToken && <Route path="/dashboard" element={ <Dashboard/>} />} 
        {authToken && <Route path="/startup" element={<Startup/>} />}

        {<Route path="/stories" element={<Stories/>} />}
      </Routes>
    </BrowserRouter>
  )
}


export default App
