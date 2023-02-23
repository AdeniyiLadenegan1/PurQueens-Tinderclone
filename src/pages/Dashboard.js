import axios from 'axios'
import { useEffect, useState } from 'react'
import TinderCard from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'
import { useCookies } from 'react-cookie'

import { useRef } from 'react'
import lottie from 'lottie-web'


const Dashboard = () => {

    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [lastDirection, setLastDirection] = useState()
    const [genderedUser, setGenderedUser ] = useState(null)
    


    const userId = cookies.UserId

    const getUser = async () => {

        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
            })
            setUser(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getGenderedUsers = async () => {

        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: { gender: user?.gender_interest }
            })
            setGenderedUsers(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUser()
        
    }, [])

    useEffect(() => {
    if (user) {
        getGenderedUsers()

        
    }

    

    }, [user])
    // console.log('user', user)
    // console.log('gendered users', genderedUsers)

    const updateMatches = async (matchedUserId) => {

        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId, matchedUserId
            })
            getUser()

        } catch (error) {
            console.log(error)
        }
     
    }
    // console.log(user)
    const swiped = (direction, swipedUserId, genderedUser) => {

        if (direction === 'right') {
            updateMatches(swipedUserId)
        
        }
        // console.log('removing: ' + nameToDelete)
        setLastDirection(direction)
        setGenderedUsers(swipedUserId)
        setGenderedUser(genderedUser)
       
        
    }
    
    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }
    


    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId)
    const filteredGenderedUsers = genderedUsers?.filter(

        genderedUser => !matchedUserIds.includes(genderedUser.user_id)

    )

    const container = useRef(null)
    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true, 
            autoplay: true,
            animationData: require('../success.json')
        })
    }, [container])
   

    return (<>
        {user &&
            <div className="dashboard">
                <ChatContainer user={user} />
                <div className="swipe-container">
                    <div className="card-container">

                        {filteredGenderedUsers?.map((genderedUser) =>
                            <TinderCard
                                className='swipe'
                                key={genderedUser.first_name}
                                preventSwipe={['up', 'down']}
                                onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>

                                <div style={{ backgroundImage: 'url(' + genderedUser.url + ')' }}
                                    className='card'>
                                    <h3>{genderedUser.first_name}</h3>
                                </div>
                            </TinderCard>

                        )}
                        <div className="swipe-info">
                        <div className='container' ref={container}>
                            {lastDirection ? <p>you swiped {lastDirection}</p> : <p />}
                            </div>
                        <div className='container' ref={container}> 
                            {genderedUser ? <p>is now a friend {genderedUser}</p> : <p />}
                        
                        </div>
                        </div>

                    </div>
                </div>
            </div>}
    </>
    )
}

export default Dashboard;