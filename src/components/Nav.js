import secondlogo from '../images/logo3.jpg'
import firstlogo from '../images/logo2.jpg'


const Nav = ({ authToken, minimal, setShowModal, showModal, setIsSignUp }) => {

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

    return (

        <nav>
            <div className="logo-container">
                <img className="pic" src={minimal ? firstlogo : secondlogo} />
            </div>
           
            {!authToken && !minimal && <button
                className="nav-button"
                onClick={handleClick}
                disabled={showModal}>
                Login here</button>}
                
        </nav>
    )
}

export default Nav;