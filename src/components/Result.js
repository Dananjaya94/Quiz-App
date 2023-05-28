import React, { useEffect, useState } from 'react'
import useStateContext from '../hooks/useStateContext'
import { ENDPOINTS, createAPIEndpoint } from '../api';
import { Alert, Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import {getFormatedTime} from '../helper';
import { useNavigate } from 'react-router-dom';
import {green, red} from '@mui/material/colors';
import Answer from './Answer';

export default function Result() {
  
  const {context, setContext} = useStateContext();
  const [score, setScore] = useState(0);
  const [qnsAnswers, setQnsAnswers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();


  useEffect(()=>{
    const ids = context.selectedOptions.map(X => X.QnId)
    createAPIEndpoint(ENDPOINTS.getAnswers)
    .post(ids)
    .then(res => {
      const qna = context.selectedOptions
      .map(X => ({
        ...X,
        ...(res.data.find(Y=> Y.quesnntionId === X.QnId))
      }))
      setQnsAnswers(qna);
      calculateScore(qna);
    })
    .catch(err => console.log(err))
  },[])

  const calculateScore = qna => {
     let tempScore = qna.reduce((acc, curr) => {
      return curr.answer == curr.selected ? acc + 1 : acc;
    },0)
    setScore(tempScore);

  }

  const restart = () => {
    setContext({
      timeTaken:0,
      selectedOptions:[]
    })
    navigate('/quiz');
  }

  const submitResult = () => {
    createAPIEndpoint(ENDPOINTS.participant)
    .put(context.participantId, {
      participantId: context.participantId,
      score: score,
      timeTaken: context.timeTaken
    })
    .then(
      res => {
        setShowAlert(true);
        setTimeout(()=>{
          setShowAlert(false);
        }, 4000)
      })
    .catch(err => console.log(err))
  }

  return (
    <><Card sx={{ mt: 5, display: 'flex', width: '100%', maxWidth: '640', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
          <Typography variant='h4'>Congradulations!</Typography>
          <Typography>YOUR SCORE</Typography>

          <Typography variant='h5' sx={{ fontWeight: 600 }} color={red[500]}>
            <Typography variant='span' color={green[500]}>
              {score}
            </Typography>/5
          </Typography>

          <Typography variant='h6'>
            Took {getFormatedTime(context.timeTaken) + ' mins'}
          </Typography>

          <Button
            variant='contained'
            sx={{ mx: 1 }}
            size='small'
            onClick={submitResult}>
            Submit
          </Button>

          <Button
            variant='contained'
            sx={{ mx: 1 }}
            size='small'
            color='warning'
            onClick={restart}>
            Restart
          </Button>

          <Alert
            severity='success'
            variant='string'
            sx={{
              width: '60%',
              m: 'auto',
              visibility: showAlert ? 'visible' : 'hidden'
            }}>
            Score Submitted
          </Alert>

        </CardContent>
      </Box>

      <CardMedia component="img" sx={{ width: 220 }} image='./result.png' />

    </Card>
    
    <Answer qnAnswers = {qnsAnswers} /></>
  )
}
