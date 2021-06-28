import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import {getImage, getName} from '../media'
import '../App.css'


export default function MonsterCard(props) {
    return (
		<Card className="card">
			{(props.monsterProps && props.monsterProps.imageUrl)
				? <img className="media" src={props.monsterProps.imageUrl} />
				: <img className="media_locked" src={ getImage(props.currentMonster) } />
			}
			<CardContent>
				<Typography variant="body2" color="textPrimary" component="p">
					{props.monsterProps && props.monsterProps.name 
						? props.monsterProps.name 
						: getName(props.currentMonster)
					}
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					{props.monsterProps && (props.monsterProps.edition > 0)
						? <>Edition {props.monsterProps.edition}</>
						: <>{!props.monsterProps && <>Edition Loading...</>}</>
					}
				</Typography>
			</CardContent>
			{(props.monsterCount > 0)
				?
					<Avatar aria-label="recipe" className="avatar">
						{(props.currentMonster == 11) 
						? <>👑</> 
						: <>+{props.monsterCount}</>
						}
					</Avatar>
				:
					<Avatar aria-label="recipe" className="avatar">
						<LockRoundedIcon/>
					</Avatar>
			}
		</Card>
    );
}
