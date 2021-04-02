import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Container } from '@material-ui/core';
import firebase from '../firebase/firebase'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    inline: {
        display: 'inline',
    },
}));
function User() {
    const classes = useStyles();
    const [users, setusers] = React.useState([])
    useEffect(() => {
        // let storage = localStorage.getItem('isloggedin');
        const id = firebase.auth().currentUser.uid;
        firebase.firestore().collection("user").doc(id).onSnapshot(snap => {
            var following = snap.data().following
            var newFollowing = []
            for (var i = 0; i < following.length; i++) {
                newFollowing.push(following[i])
            }
            // console.log(newFollowing)
            firebase.firestore().collection("user").onSnapshot((userSnap) => {
                var usersList = []
                var usersArray = []
                for (var i = 0; i < userSnap.docs.length; i++) {
                    if (snap.id !== userSnap.docs[i].id) {
                        usersArray.push(userSnap.docs[i])
                    }
                }
                usersArray.map((user) => {
                    var hasFollowed = false;
                    for (var j = 0; j < following.length; j++) {
                        if (following[j] === user.id) {
                            hasFollowed = true
                        }
                    }
                    usersList.push(
                        <Link to={"/userprofile/" + user.data().uid} style={{ textDecoration: 'none', color: '#808080' }}>
                            <List className={classes.root} key={user.data().uid}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        {(<Avatar >{user.data().name[0]}</Avatar>)}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.data().name}
                                        secondary={<React.Fragment>
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    // className={classes.inline}
                                                    style={{ textAlign: 'right', color: '#D3D3D3' }}
                                                    color="textPrimary"
                                                >
                                                    Following  : {user.data().following.length}
                                                </Typography>
                                            </React.Fragment>
                                            <br></br>
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    color="textPrimary"
                                                >
                                                    {user.data().description}
                                                </Typography>
                                            </React.Fragment>
                                        </React.Fragment>
                                        }
                                    />
                                    {hasFollowed ? <Button>Following</Button> : <Button variant="contained"
                                        color="secondary" onClick={() => {
                                            newFollowing.push(user.id)
                                            firebase.firestore().collection("user").doc(id).update({
                                                following: newFollowing
                                            })

                                        }}>Follow</Button>}
                                </ListItem>
                                <br></br>
                                <Divider variant="inset" component="li" />
                            </List>
                        </Link>
                    )
                })
                setusers(usersList)
            })
        })

    }, []);
    console.clear()
    return (
        <div>
            <header className='navbar'>
                <div className='navbar__title'> TweetX</div>
                <div className='navbar__item'><Link to={'/'} style={{ textDecoration: 'none', color: 1 == 2 ? '#FF1493' : '#D3D3D3' }}>
                    Feed
          </Link>{' '}</div>
                <div className='navbar__item'><Link to="/user" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'user' ? '#FF1493' : '#D3D3D3' }}>Users</Link></div>
                <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? '#FF1493' : '#D3D3D3' }}>Profile</Link></div>
            </header>
            <Container maxWidth="sm">
                {users}
            </Container>
        </div>
    )
}

export default User
