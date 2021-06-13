import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { red,green,blue } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LockRoundedIcon from '@material-ui/icons/LockRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    maxWidth: 300,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  media: {
    height: 200,
    width: 200,
    maxWidth: 300,
    alignSelf: 'center',
    paddingTop: '20%',
    paddingBottom: '5%',
  },
  media_locked: {
    height: 200,
    width: 200,
    maxWidth: 300,
    opacity: 0.2,
    color: '#0025FF',
    alignSelf: 'center',
    paddingTop: '20%',
    paddingBottom: '5%',
    // paddingTop: '50%',
  },
  avatar: {
    background: 'linear-gradient(to right bottom, #060135, #7303c0,#ec38bc, #fdeff9)',
    //backgroundColor: 'linear-gradient(right, #40E0D0, #FF8C00,#FF0080)',
    color: '#fff',
    marginLeft: 250,
    marginTop: -52,
    marginBottom: 5,
    padding: 2,
    boxShadow: 4,
    // marginRight: 5,
    // marginBottom: 5,
  },
  icon:{
    alignSelf: 'center',
  },
  locked:{
    alignSelf: 'center',
  }
}));

export default function MonsterCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root} variant="outlined">
      <img className={(props.monsterCount == 0) ? classes.media_locked : classes.media} src ={"https://storage.googleapis.com/opensea-prod.appspot.com/creature/" + props.currentMonster + ".png"}/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Monster {props.currentMonster}
        </Typography>
      </CardContent>
      {(props.monsterCount !== 0)
        ?<Avatar aria-label="recipe" className={classes.avatar}>+{props.monsterCount}</Avatar>
        :<Avatar aria-label="recipe" className={classes.avatar}><LockRoundedIcon/></Avatar>
      }
    </Card>
  );
}
