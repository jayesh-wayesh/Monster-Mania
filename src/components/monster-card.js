import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import { getmonsterImage, getMonsterName } from '../helpers/content'


const useStyles = makeStyles((theme) => ({
  root: {
    height: 300,
    maxWidth: 300,
    minWidth: 300,
    margin: 20,
  },
  root_king: {
    height: 300,
    maxWidth: 300,
    minWidth: 300,
    margin: 20,
    boxShadow: '10px 10px 10px rgba(25,25,25,0.1)'
  },
  media: {
    maxHeight: 200,
    maxWidth: 200,
    alignSelf: 'center',
    paddingTop: 20,
  },
  media_locked: {
    maxHeight: 200,
    maxWidth: 200,
    alignSelf: 'center',
    paddingTop: 20,
    opacity: 0.2,
    color: '#0025FF',
  },
  avatar: {
    background: 'linear-gradient(to right bottom, #600083, #cbb4d4)',
    color: '#fff',
    marginLeft: 245,
    marginTop: -55,
    padding: 2,
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
    <Card className={(props.currentMonster == 11) ? classes.root_king : classes.root}>
      <img className={(props.monsterCount == 0) ? classes.media_locked : classes.media} src={getmonsterImage(props.currentMonster - 1)} />
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="p">
          {getMonsterName(props.currentMonster - 1)}
        </Typography>
        {(props.edition !== 0) &&
          <Typography variant="body2" color="textSecondary" component="p">
            Edition {props.edition ? props.edition : <>Loading...</>}
          </Typography>
        }
      </CardContent>
      {(props.monsterCount !== 0)
        ?<Avatar aria-label="recipe" className={classes.avatar}>{(props.currentMonster == 11) ? <>👑</> : <>+{props.monsterCount}</>}</Avatar>
        :<Avatar aria-label="recipe" className={classes.avatar}><LockRoundedIcon/></Avatar>
      }
    </Card>
  );
}
