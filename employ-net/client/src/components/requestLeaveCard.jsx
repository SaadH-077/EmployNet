import React from 'react';
import { Card, CardActions, CardContent, CardActionArea, Typography } from '@mui/material';
import Link from '@mui/joy/Link'

const RequestLeaveCard = ({ onClick }) => {
  return (
    <Card sx={{ maxWidth: 345, m:1, minHeight: 225}}>
      <CardActionArea onClick={onClick} sx={{minHeight:"inherit"}}>
        <CardContent>
          <Typography gutterBottom variant="h4" sx={{fontFamily:"roboto", fontWeight:"500"}}>
            Request Leave
          </Typography>
          <Typography variant="body2" color="text.secondary">
        Take some time off. You've earned it.
      </Typography>
        </CardContent>
        <CardActions>
          {/* You can put any other actions or information here */}
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default RequestLeaveCard;
