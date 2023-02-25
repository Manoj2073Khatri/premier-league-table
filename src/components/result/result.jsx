import React, { useState,useEffect } from 'react'
import './result.scss'
const Result = ({result}) => {

    const [gameState,setGameState] =useState('')

    useEffect(() => {
        
       
        let isMounted=true;
        if(isMounted && result){

              setGameState(result);

        }
    
      return () => {
        isMounted=false;
      }
    }, [result])
    
  return (
    <div className='result_wrapper'>
        {
           gameState==="win" &&  <span className='win'>W</span>
        }
        {
             gameState==="lose" &&  <span className='lose'>L</span>
        }
        
       {
            gameState==="draw" &&  <span className='draw'>D</span>
       }
       
     
    </div>
  )
}

export default Result