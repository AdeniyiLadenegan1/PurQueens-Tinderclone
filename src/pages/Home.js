import Nav from '../components/Nav';
import AuthModal from '../components/AuthModal';
import { useState } from 'react'
import { useCookies } from 'react-cookie';

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'


const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie ] = useCookies (['user'])


    const authToken = cookies.AuthToken;

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(true)


        if (authToken) {
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            // console.log('button clicked')

            return
        }
        setShowModal(true)
        setIsSignUp(true)

    }
    const container = useRef(null)
    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true, 
            autoplay: true,
            animationData: require('../conf.json')
        })
    }, [])
    

    return (
        
        <div className="overlay">
        
            <Nav
                authToken={authToken} 
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
        
            <div className="homepage">
                <h1 className="prime-title">Add more friends</h1>
                
                
                <button className="prime-button" onClick={handleClick}>
                <div className='container' ref={container}>
                    {authToken ? 'Signout' : 'Join to continue'}
                    </div>
                </button>
                
               
                {showModal && (
                    <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
                )}

            </div>

        </div>
      
   
    )
}

export default Home;