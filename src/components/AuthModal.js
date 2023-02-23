import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const AuthModal = ({ setShowModal, isSignUp }) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])


    let navigate = useNavigate()

    console.log(email, password, confirmPassword)
    // const isSignUp = true

    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('Passwords do not match')
                return
            }

           
            console.log('posted', email, password)
            const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, { email, password })

            setCookie('Email', response.data.email)
            setCookie('UserId', response.data.userId)
            setCookie('AuthToken', response.data.token)

            const success = response.status === 200

            if (success && isSignUp) navigate('/startup')
            if (success && !isSignUp) navigate('/dashboard')

            window.location.reload()

        } catch (error) {
            console.log(error)
        }


    }

    return (
        <div className="auth-modal">
        
            <div className="close-icon" onClick={handleClick}>(#)</div>

            <h2>{isSignUp ? 'Create Account' : 'LOG IN'}</h2>
            <p>By clicking the button, you agree to our terms and conditions, use of data in our privacy policy</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {isSignUp && <input
                    type="password"
                    name="password-check"
                    id="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}

                
                <input className='secondary-button' type='submit'/>
                <p>{error}</p>
                

            </form>
            <hr />
            <h2>Get the App here</h2>
            AUTH MODAL
        </div>
    )
}

export default AuthModal;