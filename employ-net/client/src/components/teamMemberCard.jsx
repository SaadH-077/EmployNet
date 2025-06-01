import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from "react-router-dom";

export default function TeamMemberCard({user}) {
  let navigate = useNavigate();
  const redirectToMemberInfo = () => {
    // Redirect to the member info page
    navigate(`/manager-team-info/${user._id}`);
  }

  return (
    <Card
      variant="outlined"
      sx={{
        width: {xs: "60vw", md:320},
        // to make the card resizable
        overflow: 'auto',
        resize: 'horizontal',
        margin: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar src="/static/images/avatar/1.jpg" size="lg" />
      </Box>
      <CardContent>
        <Typography level="title-lg">{user.FirstName} {user.LastName}</Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="neutral" onClick={redirectToMemberInfo}>
              View
          </Button>
      </CardActions>
    </Card>
  );
}