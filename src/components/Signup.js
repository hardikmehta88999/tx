import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { myFirebase } from "../firebase/firebase";
import firebase from 'firebase'
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/styles";

const styles = () => ({
    "@global": {
        body: {
            backgroundColor: "#fff"
        }
    },
    paper: {
        marginTop: 100,
        display: "flex",
        padding: 20,
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#f50057"
    },
    form: {
        marginTop: 1
    },
    errorText: {
        color: "#f50057",
        marginBottom: 5,
        textAlign: "center"
    }
});

function Signup(props) {
    const [value, setValue] = React.useState("");
    const [email, setemail] = React.useState("");
    const [password1, setpassword1] = React.useState("");
    const [password2, setpassword2] = React.useState("");
    const isAuthenticated = props.isAuthenticated;
    const handleSummit = (e) => {

        myFirebase
            .auth().createUserWithEmailAndPassword(email, password1).then(user => {
                let obj = { userUID: user.user.uid }
                localStorage.setItem('isloggedin', JSON.stringify(obj))
                firebase.firestore().collection('user').doc(user.user.uid).set({

                    email: email,
                    followers: [],
                    name: value,
                    following: [],
                    uid: user.user.uid,
                    image: "https://image.shutterstock.com/image-vector/people-vector-icon-260nw-378571234.jpg"
                })

            })
    }
    const handlecheck = () => {
        if (password1 === '')
            alert("Please Fill your Details");
        else if (password2 === '')
            alert("Please enter confirm password");
        else if (password1 !== password2) {
            alert("\nPassword did not match: Please try again...")
            return false;
        }
        else {
            handleSummit();
        }
    }
    if (isAuthenticated) {

        return <Redirect to={"/"} />;
    }
    else {
        return (
            <div> <header className='navbar'>
                <div className='navbar__title' style={{ fontSize: '35px', marginLeft: '30px' }}> TweetX</div>
            </header>
                <div style={{ float: 'left' }}>
                    <div style={{ float: 'left' }}>
                        <Link href="/login" variant="body2">
                            <Button
                                type="submit"
                                style={{ marginTop: '10px', marginLeft: '30px', borderRadius: '15px' }}
                                fullWidth
                                variant="outlined"
                                color="default"
                            >
                                Login
          </Button>
                        </Link>
                        <Typography component="h1" variant="h5" style={{ textAlign: 'left', marginLeft: '30px', marginTop: '30px' }}>
                            Create Account
        </Typography>
                    </div>
                    <Container component="main" >
                        <CssBaseline />

                        <div style={{ marginTop: '80px' }}>


                            {/* <form className={classes.form} onSubmit={() => handleSummit()}> */}
                            <Grid container spacing={2}>

                                <Grid item xs={12} style={{ marginTop: '10px' }}>
                                    <TextField
                                        autoComplete="fname"
                                        id="filled-basic" variant="filled"
                                        value={value}
                                        name="firstName"
                                        style={{ width: 300 }}
                                        fullWidth
                                        label="Name"
                                        placeholder="Enter your Name"
                                        autoFocus
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="filled-basic" variant="filled"
                                        fullWidth
                                        value={email}
                                        style={{ width: 300 }}
                                        label="Email"
                                        name="email"
                                        placeholder="Email"
                                        autoComplete="email"
                                        onChange={(e) => setemail(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="filled-basic" variant="filled"
                                        style={{ width: 300 }}
                                        value={password1}
                                        name="password"
                                        label="Password"
                                        type="password"
                                        placeholder="Password"
                                        onChange={(e) => setpassword1(e.target.value)}
                                        autoComplete="current-password"
                                        onKeyUp={(event) => {
                                            if (event.key === 'Enter') { handleSummit() }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="filled-basic" variant="filled"
                                        fullWidth
                                        value={password2}
                                        style={{ width: 300 }}
                                        name="password"
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="Confirm Password"
                                        onChange={(e) => setpassword2(e.target.value)}
                                        autoComplete="current-password"
                                        onKeyUp={(event) => {
                                            if (event.key === 'Enter') { handleSummit() }
                                        }}
                                    /></Grid>
                            </Grid>
                            <div style={{ float: 'center' }}>
                                <Button
                                    type="submit"
                                    style={{ marginTop: '10px', width: '100px', marginLeft: '190px' }}
                                    fullWidth
                                    variant="contained" color="secondary"
                                    onClick={() => {
                                        handlecheck()
                                    }}
                                >
                                    Sign Up
          </Button>
                            </div>

                            {/* </form> */}
                        </div>
                        <Box mt={5}>
                        </Box>
                    </Container >
                </div >
            </div >
        );
    }

}
function mapStateToProps(state) {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        loginError: state.auth.loginError,
        isAuthenticated: state.auth.isAuthenticated
    };
}

export default withStyles(styles)(connect(mapStateToProps)(Signup));