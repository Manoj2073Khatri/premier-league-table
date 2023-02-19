import React,{useEffect} from 'react'
import './leagueTable.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubsStart,fetchClubsSuccess,fetchClubsFailure} from '../../reduxStore/features/premereLeagueSlice/premereLeagueSlice';
import Loader from '../loader/loader';
import axios from 'axios';
import Result from '../result/result';

const LeagueTable = () => {

    const dispatch = useDispatch();
    const clubs = useSelector((state) => state.premierLeague.clubs);
    const loading = useSelector((state) => state.premierLeague.loading);
   
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


     

 

  return (
    <div>
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
             <td>{data.name}</td>
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