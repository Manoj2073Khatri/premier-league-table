import React,{useEffect} from 'react'
import './leagueTable.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubsStart,fetchClubsSuccess,fetchClubsFailure} from '../../reduxStore/features/premereLeagueSlice/premereLeagueSlice';
import Loader from '../loader/loader';
import axios from 'axios';
import Result from '../result/result';
import ClubInfo from '../clubInfo/clubInfo';
import { modalOpen } from '../../reduxStore/features/modalSlice/modalSlice';


const LeagueTable = () => {

    const dispatch = useDispatch();
    const clubs = useSelector((state) => state.premierLeague.clubs);
    const loading = useSelector((state) => state.premierLeague.loading);
    const modalState = useSelector((state) => state.modal.modalState); 
    
   
    useEffect(() => {
        const fetchClubs = async () => {
          dispatch(fetchClubsStart());
       
          try {
            const response = await axios.get(
              'https://raw.githubusercontent.com/openfootball/football.json/master/2020-21/en.1.json'
            );
            const matches =await response.data.matches;
          
            console.log(matches);

            const clubs = matches.reduce((acc, match) => {

              const { score, team1, team2 } = match;

              if (score?.ft?.length === undefined) return acc; // game has not occurred

              const [score1, score2] = score.ft;

              const winner = score1 > score2 ? team1 : score2 > score1 ? team2 : 'draw';

              const loser = winner === team1 ? team2 : team1;

              if (!acc[winner]) {

                acc[winner] = { name: winner, wins: 1, draws: 0, losses: 0, goalsScored: score1, goalsConceded: score2,lastfivegame:['W']};
                
              } else {
                
                acc[winner].wins++;
                acc[winner].goalsScored += score1;
                acc[winner].goalsConceded += score2;
                acc[winner].lastfivegame.push('W');
              }


              if (!acc[loser]) {

                acc[loser] = { name: loser, wins: 0, draws: 0, losses: 1, goalsScored: score2, goalsConceded: score1 ,lastfivegame:['L']};

              } else {
                acc[loser].losses++;
                acc[loser].goalsScored += score2;
                acc[loser].goalsConceded += score1;
                acc[loser].lastfivegame.push('L');
              }


              if (winner === 'draw') {
                acc[team1].draws++;
                acc[team1].goalsScored += score1;
                acc[team1].goalsConceded += score2;
                acc[team1].lastfivegame.push('D');

                acc[team2].draws++;
                acc[team2].goalsScored += score2;
                acc[team2].goalsConceded += score1;
                acc[team2].lastfivegame.push('D');
              }
             // console.log("acc: " , acc);

              return acc;

            }, {});

             console.log("clubs: " , clubs);
            const clubsArray = Object.values(clubs).map((club) => {
              const points = club.wins * 3 + club.draws;
              const goalDifference=club.goalsScored-club.goalsConceded;
              const gamesPlayed=club.wins+club.draws+club.losses;

             // const lastfivegames=getLastFiveResults(club.name);

              return { ...club, points,goalDifference,gamesPlayed};
            });

            clubsArray.sort((a, b) => {
                if(a.name > b.name) return 1;
                if(a.name < b.name) return -1;
              return 0;
            });
            
            dispatch(fetchClubsSuccess(clubsArray));


          } catch (error) {
            dispatch(fetchClubsFailure());
          }
        };
        fetchClubs();
      }, [dispatch]);


     
  const handleClick=(dataIndex)=>{
       dispatch(modalOpen(dataIndex));
      
       
  }
 

  return (
    <div>
       <ClubInfo />
       {loading? <Loader/>

       :
       (
        <table>
        <tbody>
            <tr>
                <th>Position</th>
                <th>Club</th>
                <th>Played</th>
                <th>Won</th>
                <th>Drawn</th>
                <th>Lost</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Points</th>
                <th>Form</th>
                
            </tr>
       {
         clubs.filter((data,index)=>{return data.name!=='draw'}).map((data,index)=>{
            return <tr key={index}>
             <td>{index + 1}</td>
             <td><div className='club_info'><img height={24} width={24} src='data:image/png;base64,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' alt={data.name}/>
               <div onClick={()=>handleClick(index)} className="club_title"> {data.name}</div>
             </div>
             
             </td>
             <td>{data.gamesPlayed}</td>
             <td>{data.wins}</td>
             <td>{data.draws}</td>
             <td>{data.losses}</td>
             <td>{data.goalsScored}</td>
             <td>{data.goalsConceded}</td>
             <td>{data.goalDifference}</td>
             <td>{data.points}</td>
             <td><Result result={data.lastfivegame}/></td>
         </tr>
        
            
         })
       }
        
         </tbody>

         </table>
       )

       }
    
   </div>
  )
}

export default LeagueTable