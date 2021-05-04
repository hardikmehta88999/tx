import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { myFirebase } from "../firebase/firebase";
import firebase from 'firebase'
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";

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
    const { classes } = props;

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
                    name: value,
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
            <div>
                <header className='navbar'>
                    <div className='navbar__title' style={{ fontSize: '35px', marginLeft: '30px' }}> NGK</div>
                </header>
                <Container maxWidth='md'>
                    <Paper className={classes.paper} style={{ height: '450px' }}>
                        <div style={{ float: 'left' }}>
                            <Link href='/login' style={{ textDecoration: 'underline' }}>
                                <Typography component="h1" variant="h5" style={{ textAlign: 'center', marginTop: "20px" }} >
                                    Go to login
                                </Typography>
                            </Link>
                        </div>

                        <div style={{ float: 'right' }}>
                            <TextField
                                margin="normal"
                                autoComplete="fname"
                                value={value}
                                name="firstName"
                                fullWidth
                                label="Name"
                                placeholder="Enter your Name"
                                autoFocus
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                value={email}
                                label="Email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                onChange={(e) => setemail(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                fullWidth
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
                            <TextField
                                fullWidth
                                margin="normal"

                                value={password2}
                                name="password"
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm Password"
                                onChange={(e) => setpassword2(e.target.value)}
                                autoComplete="current-password"
                                onKeyUp={(event) => {
                                    if (event.key === 'Enter') { handleSummit() }
                                }}
                            />
                            <div style={{ float: 'center' }}>
                                <Button
                                    type="button"
                                    style={{ marginTop: '10px', width: '100px', }}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={() => {
                                        handlecheck()
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </div>
                    </Paper>
                </Container>
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