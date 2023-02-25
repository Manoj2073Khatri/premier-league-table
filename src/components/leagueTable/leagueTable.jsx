import React,{useEffect} from 'react'
import './leagueTable.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubsStart,fetchClubsSuccess,fetchClubsFailure} from '../../reduxStore/features/premereLeagueSlice/premereLeagueSlice';
import Loader from '../loader/loader';
import axios from 'axios';

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

            const clubs = matches.reduce((acc, match) => {

              const { score, team1, team2 } = match;

              if (score?.ft?.length === undefined) return acc; // game not occurred

         
              const [score1, score2] = score.ft;

              const winner = score1 > score2 ? team1 : score2 > score1 ? team2 : 'draw';

              const loser = winner === team1 ? team2 : team1;

              if (!acc[winner]) {
                acc[winner] = { name: winner, wins: 1, draws: 0, losses: 0, goalsScored: score1, goalsConceded: score2};

              } else {

                acc[winner].wins++;
                acc[winner].goalsScored += score1;
                acc[winner].goalsConceded += score2;
              }


              if (!acc[loser]) {

                acc[loser] = { name: loser, wins: 0, draws: 0, losses: 1, goalsScored: score2, goalsConceded: score1 };

              } else {
                acc[loser].losses++;
                acc[loser].goalsScored += score2;
              }


              if (winner === 'draw') {
                acc[team1].draws++;
                acc[team1].goalsScored += score1;
                acc[team1].goalsConceded += score2;
                acc[team2].draws++;
                acc[team2].goalsScored += score2;
                acc[team2].goalsConceded += score1;
              }
              return acc;

            }, {});


            const clubsArray = Object.values(clubs).map((club) => {
              const points = club.wins * 3 + club.draws;
              const goalDifference=club.goalsScored-club.goalsConceded;
              const gamesPlayed=club.wins+club.draws+club.losses;
              return { ...club, points,goalDifference,gamesPlayed };
            });

            clubsArray.sort((a, b) => {
              if (a.points > b.points) return -1;
              if (a.points < b.points) return 1;
              if (a.goalsScored - a.goalsConceded > b.goalsScored - b.goalsConceded) return -1;
              if (a.goalsScored - a.goalsConceded < b.goalsScored - b.goalsConceded) return 1;
              return 0;
            });

            dispatch(fetchClubsSuccess(clubsArray));


          } catch (error) {
            dispatch(fetchClubsFailure());
          }
        };
        fetchClubs();
      }, [dispatch]);


   console.log(clubs)

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
                <th>GF(goal scored)</th>
                <th>GA(goal concede)</th>
                <th>GD(goal difference)</th>
                <th>Points</th>
                <th>Form</th>
                
            </tr>
       {
         clubs.filter((data,index)=>{return index>=1}).map((data,index)=>{
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
             <td></td>
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