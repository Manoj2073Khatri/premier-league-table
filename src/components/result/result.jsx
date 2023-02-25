import React, { useState,useEffect } from 'react'
import './result.scss'
const Result = ({result}) => {

    const [gameState,setGameState] =useState([])

    useEffect(() => {
        
       
        let isMounted=true;
        if(isMounted && result){
           setGameState( result.slice(-5).reverse());

        }
    
      return () => {
        isMounted=false;
      }
    }, [result])
    
  return (
    <div className='result_wrapper'>
       {
        gameState.map((data,index)=>{
          return(<div key={index}>
             {
           data==="W" &&  <span className='win'>W</span>
        }
        {
             data==="L" &&  <span className='lose'>L</span>
        }
        
       {
            data==="D" &&  <span className='draw'>D</span>
       }
          </div>)
        })
       }
       
     
    </div>
  )
}

export default Result