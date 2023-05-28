import { Accordion, AccordionDetails, AccordionSummary, Box, CardMedia, List, ListItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import { BASE_URL } from '../api'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { green, red, grey } from '@mui/material/colors';

export default function Answer({qnAnswers}) {

    const [expanded, setExpanded] = useState(false);

    const handleAccordianChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel :false);
    };

    const markCorrectOrNot = (qna, idx) => {
        if ([qna.answer, qna.selected].includes(idx)) {
            return { sx: { color: qna.answer == idx ? green[500] : red[500] } }
        }
    }

  return (
    <Box sx={{mt:5, width:'100%', maxWidth:640, mx:'auto'}}>
        {qnAnswers.map((item,j) => (
            <Accordion 
            disableGutters
            key={j}
            expanded={expanded === j}
            onChange={handleAccordianChange(j)}>
                <AccordionSummary 
                expandIcon={<ExpandCircleDownIcon
                    sx={{
                        color: item.answer == item.selected ? green[500] : red[500]
                    }}
                    />}>
                    <Typography
                    sx={{width: '90%', flexShrink:0}}>
                        {item.qustionInWords}
                    </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ backgroundColor: grey[900]}}>
                    {item.imageName ?
                    <CardMedia
                    component="img"
                    image={BASE_URL + 'images/' + item.imageName}
                    sx={{m: '10px auto', width:'90%'}}/> : null}

                    <List>
                        {item.options.map((x,i) =>
                        <ListItem key={i}>
                            <Typography {...markCorrectOrNot(item,i)}>
                                <b>
                                    {String.fromCharCode(65 + i) + " . "}
                                </b>{x}
                            </Typography>
                        </ListItem>)}
                    </List>
                </AccordionDetails>
            </Accordion>
        ))}
    </Box>
  )
}
