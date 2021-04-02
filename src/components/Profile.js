import React, { useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Container } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import firebase from '../firebase/firebase'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { logoutUser } from "../actions";
import { pink } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
// import CommentIcon from '@material-ui/icons/Comment';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 550,
        marginTop: '30px'
    },
    inline: {
        display: 'inline',
    },
    avatar: {
        backgroundColor: pink[500],
    },
}));
function Profile(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [user, setuserdata] = React.useState([]);
    const [userPost, setposts] = React.useState([]);
    const [following, setarray1] = React.useState([]);
    const [follower, setarrayfollower] = React.useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleLogout = () => {
        const { dispatch } = props;
        dispatch(logoutUser());
    };
    useEffect(() => {
        // let storage = localStorage.getItem('isloggedin');
        const id = firebase.auth().currentUser.uid;
        firebase.firestore().collection('user').doc(id).onSnapshot(snap => {
            let arr = []
            arr.push(snap.data())
            setuserdata(arr)
        })
        firebase.firestore().collection('post').where('uid', '==', id).orderBy('timeStamp', "desc").onSnapshot(snap => {
            let userpost = []
            snap.forEach(value => userpost.push(value.data()))
            setposts(userpost)
        })
        firebase.firestore().collection("user").onSnapshot((usersSnap) => {
            var userList = usersSnap.docs
            var follow = []
            var userarrayList = []
            firebase.firestore().collection("user").doc(id).onSnapshot((snap) => {
                follow = snap.data().following

                var name;
                var followinglength;
                var userid;
                for (var i = 0; i < follow.length; i++) {

                    for (var j = 0; j < userList.length; j++) {
                        if (userList[j].id === follow[i]) {
                            name = userList[j].data().name
                            userid = userList[j].data().uid
                            followinglength = userList[j].data().following
                        }
                    }
                    userarrayList.push(
                        <List className={classes.root} key={userid}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    {(<Avatar style={{ width: '50px', height: '50px' }}>{name[0]}</Avatar>)}

                                </ListItemAvatar>
                                <ListItemText
                                    primary={name}
                                    secondary={<React.Fragment>
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                                style={{
                                                    color: '#D3D3D3'
                                                }}
                                            >
                                                Following : {followinglength.length}
                                            </Typography>
                                        </React.Fragment>
                                        <br></br>

                                    </React.Fragment>
                                    }
                                />
                                <Button>Following</Button>

                            </ListItem>

                            <Divider variant="inset" component="li" />
                        </List>
                    )
                }
                setarray1(userarrayList)
            })
        })

        firebase.firestore().collection("user").onSnapshot((usersSnap) => {
            var userList = usersSnap.docs
            firebase.firestore().collection("user").doc(id).onSnapshot((snap) => {
                var follow = []
                follow = snap.data().followers
                var following = []
                following = snap.data().following
                var newFollowing = []
                for (var i = 0; i < following.length; i++) {
                    newFollowing.push(following[i])
                }
                var name;
                var followinglength;
                var profiles = []

                follow.map((foll) => {
                    var alreadyfollowed = false;
                    var hisFollowers = [];
                    for (var k = 0; k < following.length; k++) {
                        if (following[k] === foll) {
                            alreadyfollowed = true
                        }
                    }
                    for (var j = 0; j < userList.length; j++) {
                        if (userList[j].id === foll) {
                            name = userList[j].data().name
                            followinglength = userList[j].data().following
                            hisFollowers = userList[j].data().followers
                        }
                    }

                    profiles.push(
                        <List className={classes.root}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    {(<Avatar style={{ width: '50px', height: '50px' }}>{name[0]}</Avatar>)}

                                </ListItemAvatar>
                                <ListItemText
                                    primary={name}
                                    secondary={<React.Fragment>
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                                style={{ color: '#D3D3D3' }}
                                            >
                                                Following : {followinglength.length}
                                            </Typography>
                                        </React.Fragment>
                                        <br></br>
                                    </React.Fragment>

                                    }
                                />
                                {alreadyfollowed ? <Button>Following</Button> : <Button variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        newFollowing.push(foll)
                                        firebase.firestore().collection("user").doc(id).update({
                                            "following": newFollowing
                                        })
                                        hisFollowers.push(id)
                                        firebase.firestore().collection("user").doc(foll).update({
                                            "followers": hisFollowers
                                        })
                                    }}
                                >Follow</Button>}

                            </ListItem>

                            <Divider variant="inset" component="li" />
                        </List>
                    )
                })
                setarrayfollower(profiles)
            })
        })

    }, []);
    console.clear()

    return (<div> <header className='navbar'>
        <div className='navbar__title'> TweetX</div>
        <div className='navbar__item'><Link to={'/'} style={{ textDecoration: 'none', color: 1 == 2 ? '#FF1493' : '#D3D3D3' }}>
            Feed
          </Link>{' '}</div>
        <div className='navbar__item'><Link to="/user" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'user' ? '#FF1493' : '#D3D3D3' }}>Users</Link></div>
        <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? '#FF1493' : '#D3D3D3' }}>Profile</Link></div>
        <Button variant="contained"
            color="secondary" onClick={
                handleLogout
            }>Logout</Button>
    </header>
        <Container maxWidth="sm">
            {user.map(data => {
                return (
                    <List className={classes.root} key={data.uid}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                {(<Avatar style={{ width: '70px', height: '70px' }}>{data.name[0]}</Avatar>)}

                            </ListItemAvatar>
                            <ListItemText
                                primary={<React.Fragment><Typography style={{ marginLeft: '40px', marginTop: '20px' }}>{data.name}</Typography></React.Fragment>}
                                secondary={<React.Fragment>
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            style={{ color: '#D3D3D3', marginLeft: '20px', marginTop: '20px' }}
                                            color="textPrimary"
                                        >
                                            Posts : {userPost.length} &nbsp; followers : {data.followers.length} &nbsp;Following : {data.following.length}
                                        </Typography>
                                    </React.Fragment>
                                </React.Fragment>

                                }
                            />
                        </ListItem>

                    </List>


                )
            })}
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
            >
                <Tab label={"Post"} ></Tab>
                <Tab label="Followers" />
                <Tab label="Following" />
            </Tabs>
            <TabPanel value={value} index={0}>
                {
                    userPost.map(data => {
                        return (
                            <Card className={classes.root}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" >
                                            {data.name[0]}
                                        </Avatar>
                                    }

                                    title={data.name}
                                />
                                {/* <Typography variant="body2" color="textSecondary" component="p" style={{ textAlign: 'right', marginRight: '40px', marginTop: '-50px' }}>
                                    {data.name}
                                </Typography> */}
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p" style={{ marginLeft: '40px', marginRight: '28px', marginTop: '-15px' }}>
                                        {data.description.split(" ").splice(0, 28).join(" ")} <Avatar style={{ marginTop: '-40px', marginLeft: '415px', backgroundColor: '#FFB6C1' }} >
                                        </Avatar>
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {follower}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {following}
            </TabPanel>
        </Container >
    </div>
    );
}
function mapStateToProps(state) {
    return {
        isLoggingOut: state.auth.isLoggingOut,
        logoutError: state.auth.logoutError,
        isAuthenticated: state.auth.isAuthenticated

    };
}

export default connect(mapStateToProps)(Profile)