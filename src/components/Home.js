import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import '../App.css'
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import firebase from '../firebase/firebase';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    color: 'secondary'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    maxWidth: 550,
    marginTop: '30px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  // avatar: {
  //   backgroundColor: pink[500],
  // },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Home(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setdescription] = React.useState('')
  const [name, setname] = React.useState('')
  const [image, setimage] = React.useState('')
  const [post, setposts] = React.useState([])
  const handleClickOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    const id = firebase.auth().currentUser.uid;
    firebase.firestore().collection('user').doc(id).onSnapshot(snap => {
      setname(snap.data().name)
      setimage(snap.data().image)
      var following = []
      following = (snap.data().following)
      for (var i = 0; i < following.length; i++) {
        var k = following[i]
        firebase.firestore().collection('post').where('uid', '==', k).orderBy('timeStamp', 'desc').onSnapshot(snap => {
          let arr = []
          snap.forEach(value => {
            arr.push(value.data())
          })
          setposts(arr)
        })
      }

    })

  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleShare = () => {
    setOpen(false);
    if (description.length > 0) {
      const id = firebase.auth().currentUser.uid;
      firebase.firestore().collection('post').add({
        uid: id,
        description: description,
        name: name,
        image: image,
        timeStamp: new Date()
      })
    }

  }
  console.clear()

  return (
    < div > <header className='navbar'>
      <div className='navbar__title'> TweetX</div>
      <div className='navbar__item'><Link to={'/'} style={{ textDecoration: 'none', color: 1 == 1 ? '#FF1493' : '#D3D3D3' }}>
        Feed
          </Link>{' '}</div>
      <div className='navbar__item'><Link to="/user" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'user' ? '#FF1493' : '#D3D3D3' }}>Users</Link></div>
      <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? '#FF1493' : '#D3D3D3' }}>Profile</Link></div>


    </header>
      <Container maxWidth="sm">

        <Button variant="contained" color="secondary" style={{ marginTop: '10px' }} onClick={() => handleClickOpen()}>
          Write
                     </Button>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Write Something to Post
            </Typography>
              <Button autoFocus color="inherit" onClick={handleShare}>
                Share
            </Button>
            </Toolbar>
          </AppBar>
          <TextareaAutosize
            style={{ width: '100%', height: '200px' }}
            variant="outlined"
            margin="normal"
            fullWidth
            name="description"
            placeholder="Description"
            type="textarea"
            id="description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />

        </Dialog>
        {post.map(data => {
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
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p" style={{ textAlign: 'center', marginLeft: '40px', marginTop: '-20px', marginRight: '20px' }}>
                  {data.description.split(" ").splice(0, 30).join(" ")}
                  <Avatar className={classes.avatar} style={{ marginTop: '-60px', marginLeft: '465px', backgroundColor: '#FFB6C1' }} >
                  </Avatar>
                </Typography>
              </CardContent>
            </Card>

          )
        })}

      </Container>
    </div >
  );
}
function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
    isAuthenticated: state.auth.isAuthenticated

  };
}

export default connect(mapStateToProps)(Home)