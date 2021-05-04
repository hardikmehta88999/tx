
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import firebase from '../firebase/firebase'
import SearchBar from 'material-ui-search-bar'
import { Grid, Paper, Table, TableHead, TableRow, TableCell, withStyles, TableBody, TablePagination, Container } from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit';
import { Redirect } from 'react-router-dom'



const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: 'grey',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            VehicleDetails: [],
            search: "",
            loader: true,
            page: 0,
            rowsPerPage: 8
        }
    }

    componentDidMount() {
        firebase.firestore().collection("Vehicle").onSnapshot((snapshot) => {
            snapshot.forEach((event) => {
                let vehicle = this.state.VehicleDetails.push(event.data())
                vehicle = [...this.state.VehicleDetails]
                this.setState({ VehicleDetails: vehicle })
            })
        })
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage })
    };

    renderUsers = () => {
        let arr = this.state.VehicleDetails;
        if (this.state.search.length > 0) {
            arr = this.state.VehicleDetails.filter(user => {
                if (user.VehicleNumber != null && user.VehicleNumber.toLowerCase().startsWith(this.state.search.toLowerCase())) {
                    return true;
                } else {
                    return false;
                }
            })
        }
        let start = (arr.length >= this.state.page * this.state.rowsPerPage) ? this.state.page * this.state.rowsPerPage : 0;
        return arr.slice(start, (this.state.page * this.state.rowsPerPage) + this.state.rowsPerPage).map(user => {
            return (
                <StyledTableRow key={user.VehicleNumber}>
                    <StyledTableCell component="th" scope="row">
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginLeft: '10px' }}>
                                <div style={{ fontSize: '15px', fontWeight: '500' }}>{user.VehicleNumber}</div>
                            </div>
                        </div>
                    </StyledTableCell>
                    <StyledTableCell align="right">{(user.FitnessUpto)}</StyledTableCell>
                    <StyledTableCell align="right">{(user.TaxUpto)}</StyledTableCell>
                    <StyledTableCell align="right">{(user.PollutionUpto)}</StyledTableCell>
                    <StyledTableCell align="right">{(user.InsuranceUpto)}</StyledTableCell>
                    <StyledTableCell align="right">{(user.InsuranceCompany)}</StyledTableCell>
                    <StyledTableCell align="right">{
                        <Link to={"/editVehicle/" + user.VehicleNumber}>
                            <EditIcon style={{ cursor: 'pointer' }} />
                        </Link>

                    }</StyledTableCell>

                </StyledTableRow >
            )
        })
    }
    renderMain = () => {
        return (
            <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: '400', color: "#A8A8A8", fontStyle: 'italic' }}>Here,we have overall analysis !</div>
                <Grid container style={{ marginTop: '20px' }} spacing={2}>
                    <Grid md={12} item>
                        <Paper>
                            <SearchBar
                                value={this.state.search}
                                onChange={(e) => this.setState({ search: e })}
                                onRequestSearch={() => console.log('onRequestSearch')}
                                style={{
                                    margin: '0 auto',
                                    maxWidth: 800
                                }}
                            />
                            <Table aria-label="customized table" style={{ marginTop: '10px' }} className="card">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Vehicle Number</StyledTableCell>
                                        <StyledTableCell align="right">Fitness Upto</StyledTableCell>
                                        <StyledTableCell align="right">Tax Upto</StyledTableCell>
                                        <StyledTableCell align="right">Pollution Upto</StyledTableCell>
                                        <StyledTableCell align="right">Insurance Upto</StyledTableCell>
                                        <StyledTableCell align="right">Insurance Company</StyledTableCell>
                                        <StyledTableCell align="right">Edit</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.renderUsers()}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[8]}
                                component="div"
                                count={this.state.VehicleDetails.length}
                                rowsPerPage={8}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
        // }
    }


    render() {
        console.log("vehicle Information", this.state.VehicleDetails)
        return (
            <div>
                <header className='navbar'>
                    <div className='navbar__title'> NGK</div>
                    <div className='navbar__item'><Link to={'/'} style={{ textDecoration: 'none', color: 1 == 2 ? 'blue' : '#D3D3D3' }}>
                        Form
          </Link>{' '}</div>
                    <div className='navbar__item'><Link to="/user" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'user' ? 'blue' : '#D3D3D3' }}>Entries</Link></div>
                    <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? 'blue' : '#D3D3D3' }}>Profile</Link></div>
                </header>
                <Container component="main" maxWidth="sm">
                    {this.renderMain()}
                </Container>
            </div >
        )
    }
}

