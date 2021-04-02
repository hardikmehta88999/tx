import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../actions";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { InputAdornment } from '@material-ui/core';
import { RemoveRedEye } from '@material-ui/icons';
// import tree from "../images/tree.jpg"
import firebase from 'firebase'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
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

class Login extends Component {
  state = {
    email: "", password: "", passwordhide: true
  };


  handleEmailChange = ({ target }) => {
    this.setState({ email: target.value });
  };

  handlePasswordChange = ({ target }) => {
    this.setState({ password: target.value });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { email, password } = this.state;

    dispatch(loginUser(email, password));
  };
  togglePassword = () => {
    this.setState(prevState => ({
      passwordhide: !prevState.passwordhide,
    }));
  };

  handleForgot = () => {
    var email = window.prompt("Please provide email")
    firebase.auth().sendPasswordResetEmail(email);
  }
  render() {
    console.clear()
    const { classes, loginError, isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to="/" />;
    } else {
      return (
        <div >
          <header className='navbar'>
            <div className='navbar__title' style={{ fontSize: '35px', marginLeft: '30px' }}> TweetX</div>
          </header>
          <div style={{ float: 'left' }}>

            <div style={{ float: 'left' }} >

              <Link href="/signup" variant="body2">
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  style={{ marginTop: '10px', marginLeft: '30px', borderRadius: '15px' }}

                  color="default"
                  className={classes.submit}

                >
                  Create Account
            </Button>
              </Link>
              <Typography component="h1" variant="h5" style={{ textAlign: 'left', marginLeft: '30px', marginTop: '30px', fontSize: '40px' }}>
                Login
        </Typography>
            </div>
            <Container component="main" >
              <div style={{ marginTop: '80px' }} >
                {/* style={{ backgroundImage: `url(${imageUrl})` }} */}

                <Grid container spacing={2}>
                  <Grid item xs={12} style={{ marginTop: '10px' }}>
                    <TextField
                      margin="normal"
                      id="filled-basic" variant="filled"
                      style={{ width: 300 }}
                      label="Email"
                      name="email"
                      onChange={this.handleEmailChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      id="filled-basic" variant="filled"
                      name="password"
                      style={{ width: 300 }}
                      label="Password"
                      type={this.state.passwordhide ? "password" : "text"}
                      onChange={this.handlePasswordChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {this.state.passwordhide ? <RemoveRedEye onClick={this.togglePassword} style={{ cursor: 'pointer' }} /> : <VisibilityOffIcon onClick={this.togglePassword} style={{ cursor: 'pointer' }} />}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {loginError && (
                  <Typography component="p" className={classes.errorText}>
                    Incorrect email or password.
                  </Typography>
                )}
                <Typography component="h6" variant="h6" onClick={this.handleForgot} style={{ cursor: 'pointer' }}>
                  Forgot Password ?
            </Typography>
                <div style={{ float: 'center' }}>


                  <Button
                    type="button"
                    fullWidth
                    style={{ marginTop: '-20px', width: '100px', marginLeft: '195px' }}

                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    onClick={this.handleSubmit}
                  >
                    Login
            </Button>

                </div>

              </div>

            </Container>
          </div>


        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default withStyles(styles)(connect(mapStateToProps)(Login));
