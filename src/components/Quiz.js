import React, { useContext, useEffect, useState } from 'react'
import useStateContext, { stateContext } from '../hooks/useStateContext'
import { BASE_URL, ENDPOINTS, createAPIEndpoint } from '../api'
import { Box, Card, CardContent, CardHeader, CardMedia, LinearProgress, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { getFormatedTime } from '../helper';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  
    //const {context, setContext} = useStateContext();
    
    const [qstion, SetQstion] = useState([]);
    const [qsIndex, setQsIndex] = useState(0);
    const [timeTaken, SetTimeTaken] = useState(0);
    const {context,setContext} = useStateContext();
    const navigate = useNavigate();

    let timer;

    const startTimer = () =>{
      timer = setInterval(()=>{
        SetTimeTaken(prev => prev + 1);
      },[1000])
    }
    useEffect(()=>{
      setContext({
        timeTaken:0,
        selectedOptions: []
      })
      createAPIEndpoint(ENDPOINTS.question)
      .fetch()
      .then(res => {
        SetQstion(res.data)
        startTimer()
      })
      .catch(err => console.log(err))
    return () => {clearInterval(timer)}
    },[])

    const updateAnswer =(QnId,QnIndx)=>{
      const temp = [...context.selectedOptions]
      temp.push({
        QnId,
        selected: QnIndx
      })

      if(qsIndex < 4){
        setContext({selectedOptions: [...temp]})
        setQsIndex(qsIndex + 1)
      }
      else{
        setContext({selectedOptions: [...temp], timeTaken})
        //navigate to result component
        navigate('/result')
      }
    }

    return (
      qstion.length!==0
      ? 
      <Card sx={{maxWidth:640, mx:'auto', my:'auto' , mt:5, '& .MuiCardHeader-action':{m:0, alignSelf:'center'}}}>
        <CardHeader 
        title={'Question '+(qsIndex+1)+' of 5'}
        action={<Typography>{getFormatedTime(timeTaken)}</Typography>}></CardHeader>

        <Box>
          <LinearProgress variant="determinate" value={(qsIndex+1)*100/5} />
        </Box>

        {qstion[qsIndex].imageName!==null
        ?<CardMedia component="img" image={BASE_URL+'images/'+qstion[qsIndex].imageName}></CardMedia>
        :null}
        <CardContent>
          <Typography variant='h6'>
            {qstion[qsIndex].qustionInWords}
          </Typography>
          
          <List>
            {qstion[qsIndex].options.map((item, indx)=>
            <ListItemButton key={indx} onClick={()=>updateAnswer(qstion[qsIndex].quesnntionId,indx)}>
              <div>
                <b>{String.fromCharCode(65+indx)+" . "}</b>{item}
              </div>
            </ListItemButton>
            )}
          </List>

        </CardContent>
      </Card>
      : null
  )
}
