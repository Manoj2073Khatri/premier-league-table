import React from 'react';
import LeagueTable from './components/leagueTable/leagueTable';
import Loader from './components/loader/loader';
import Result from './components/result/result';


function App() {
  return (
    <div className='main'>
       <h1>Premier league standings</h1>
       <LeagueTable/>
       <Loader/>
       <Result result="win"/>
    </div>
  );
}

export default App;
