import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { logoutUser } from "../actions";
import firebase from '../firebase/firebase'
import { Paper, Avatar, Grid, Button } from '@material-ui/core'

function Profile(props) {
    const [user, setUser] = useState({})
    useEffect(() => {
        var user = firebase.auth().currentUser
        if (user) {
            firebase.firestore().collection("user").doc(user.uid).onSnapshot((snapshot) => {
                setUser(snapshot.data())
            })
        }
    }, [])
    const handleLogout = () => {
        const { dispatch } = props;
        dispatch(logoutUser());
    };

    const renderMain = () => {
        return (
            <div style={{ display: 'flex', padding: '20px', flexDirection: 'column' }}>
                <h2 style={{ width: '75%', alignSelf: 'center' }}>Profile</h2>
                <Paper style={{ width: '75%', alignSelf: 'center' }}>
                    <Grid container>
                        <Grid item md={6} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'center', height: '350px' }}>
                            <Avatar style={{ height: '250px', width: '250px', alignSelf: 'center' }} src={user.image} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12} style={{ padding: '20px' }}>

                            <div style={{ display: 'flex', marginBottom: '5px' }}>
                                <div style={{ float: 'left', fontSize: '16px', fontWeight: '600', marginRight: '10px' }}>Name:</div>
                                <div style={{ fontSize: '16px', fontWeight: '400', alignSelf: 'center' }}>{user.name}</div>
                            </div>
                            <div style={{ display: 'flex', marginBottom: '5px' }}>
                                <div style={{ float: 'left', fontSize: '16px', fontWeight: '600', marginRight: '10px' }}>Email:</div>
                                <div style={{ fontSize: '16px', fontWeight: '400', alignSelf: 'center' }}>{user.email}</div>
                            </div>
                            <Button
                                variant="contained"
                                style={{ float: 'right' }}
                                color="secondary"
                                onClick={
                                    handleLogout
                                }>
                                Logout</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )
    }
    return (<div> <header className='navbar'>
        <div className='navbar__title'> NGK</div>
        <div className='navbar__item'><Link to={'/'} style={{ textDecoration: 'none', color: 1 == 2 ? 'blue' : '#D3D3D3' }}>
            Form
          </Link>{' '}</div>
        <div className='navbar__item'><Link to="/user" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'user' ? 'blue' : '#D3D3D3' }}>Entries</Link></div>
        <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? 'blue' : '#D3D3D3' }}>Profile</Link></div>

    </header>
        {renderMain()}
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