import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../actions";
import { withStyles } from "@material-ui/styles";
import Link from '@material-ui/core/Link';
import { RemoveRedEye } from '@material-ui/icons';
import { Paper, Button, Container, Typography, TextField, InputAdornment } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
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
        <div>
          <header className='navbar'>
            <div className='navbar__title' style={{ fontSize: '35px', marginLeft: '30px' }}> NGK</div>
          </header>
          <Container maxWidth='md'>
            <Paper className={classes.paper} style={{ height: '450px' }}>
              <div style={{ float: 'left' }}>
                {/* <img src={"https://static.remove.bg/remove-bg-web/2a274ebbb5879d870a69caae33d94388a88e0e35/assets/start-0e837dcc57769db2306d8d659f53555feb500b3c5d456879b9c843d1872e7baa.jpg} alt="im"></img> */}
                <Link href='/signup' style={{ textDecoration: 'underline' }}>
                  <Typography component="h1" variant="h5" style={{ textAlign: 'center', marginTop: "20px" }} >
                    Create an Account
            </Typography>
                </Link>
              </div>

              <div style={{ float: 'right' }}>
                <Typography component="h1" variant="h5" >
                  Login
            </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  id="input-with-icon-textfield"
                  placeholder="Email Address"
                  name="email"
                  onChange={this.handleEmailChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="input-with-icon-textfield"
                  name="password"
                  type={this.state.passwordhide ? "password" : "text"}
                  placeholder="Password"
                  onChange={this.handlePasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="start">
                        {this.state.passwordhide ? <RemoveRedEye onClick={this.togglePassword} style={{ cursor: 'pointer' }} /> : <VisibilityOffIcon onClick={this.togglePassword} style={{ cursor: 'pointer' }} />}
                      </InputAdornment>
                    ),
                  }}
                />
                {loginError && (
                  <Typography component="p" className={classes.errorText}>
                    Incorrect email or password.
                  </Typography>
                )}
                <Typography component="h6" variant="h6" onClick={this.handleForgot} style={{ cursor: 'pointer' }}>
                  Forgot Password ?
            </Typography>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  style={{ width: '90px', marginTop: '40px' }}
                  color="primary"
                  className={classes.submit}
                  onClick={this.handleSubmit}
                >
                  Log in
            </Button>

              </div>
            </Paper>

          </Container>
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
