import Nav from '../components/Nav'
import { useState } from 'react'



const Stories = () => {
    return (
        <>
        <div className="overlay">
            <Nav
            minimal={true}
                >
            </Nav>

    <section>
    <form action="/upload" method="POST"
    encType='multipart/form-data'>
        <div class="customfile">
            <input type="file" name="file" id="file" class="custom-file-input"></input>
            <label htmlFor="file" class="custom-file-label"> Choose files</label>
        </div>
        <input type="submit" value="Submit" className='prime-button'></input>    
    
    
    </form>
    

</section>

</div>
        </>
    )
}


export default Stories