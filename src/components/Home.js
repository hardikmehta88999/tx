
import React, { Component } from "react";
import '../App.css'
import Button from "@material-ui/core/Button";
import { Container, TextField } from "@material-ui/core";
import firebase from '../firebase/firebase';
import { myFirebase } from "../firebase/firebase";
import { Link } from 'react-router-dom';
let path
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      InsuranceUpto: "",
      FitnessUpto: '',
      TaxUpto: '',
      PollutionUpto: '',
      VehicleNumber: "",
      InsuranceCompany: "",
      status: 'create'

    };
  }
  componentDidMount() {
    path = window.location.pathname.split('/');
    if (path[2] !== undefined) {
      firebase.firestore().collection("Vehicle").doc(path[2]).get().then(vehicle => {
        this.setState({
          InsuranceUpto: vehicle.data().InsuranceUpto,
          FitnessUpto: vehicle.data().FitnessUpto,
          TaxUpto: vehicle.data().TaxUpto,
          PollutionUpto: vehicle.data().PollutionUpto,
          VehicleNumber: vehicle.data().VehicleNumber,
          InsuranceCompany: vehicle.data().InsuranceCompany,
          status: 'update'
        })
      })
    }
  }

  handleSubmit() {
    if (this.state.status === "create") {
      firebase.firestore().collection('Vehicle').doc(this.state.VehicleNumber).set({
        InsuranceUpto: this.state.InsuranceUpto,
        FitnessUpto: this.state.FitnessUpto,
        TaxUpto: this.state.TaxUpto,
        PollutionUpto: this.state.PollutionUpto,
        VehicleNumber: this.state.VehicleNumber,
        InsuranceCompany: this.state.InsuranceCompany,
        'uid': myFirebase.auth().currentUser.uid,
      }).then(() => {
        alert("form filled")
        window.location.reload()
      }
      )
    }
    else if (this.state.status === "update") {
      firebase.firestore().collection('Vehicle').doc(path[2]).update({
        InsuranceUpto: this.state.InsuranceUpto,
        FitnessUpto: this.state.FitnessUpto,
        TaxUpto: this.state.TaxUpto,
        PollutionUpto: this.state.PollutionUpto,
        VehicleNumber: this.state.VehicleNumber,
        InsuranceCompany: this.state.InsuranceCompany,
        'uid': myFirebase.auth().currentUser.uid,
      }).then(() => {
        alert("form updated")
        window.location.reload()
      }
      )

    }
  }

  validateInput = (name, value) => {
    if (value.length > 0) {
      return null;
    } else {
      return <div style={{ fontSize: '15px', color: 'grey', float: 'right', marginTop: '-8px', fontWeight: '600' }}>* {name} is required</div>
    }
  }

  validateDates = (name, value) => {
    if (value.length > 0) {
      return null;
    }
    else {
      return <div style={{ fontSize: '15px', color: 'grey', float: 'right', marginTop: '-8px', fontWeight: '600' }}>*{name} are required</div>
    }
  }
  getCurrentDate = () => {
    const d = new Date();
    return d.getYear() + 1900 + '-' + d.getMonth() + 1 + '-' + d.getDate();
  }
  setNextBtn = () => {
    const impFields = ["InsuranceUpto", "FitnessUpto", "TaxUpto", "PollutionUpto", "VehicleNumber", "InsuranceCompany"];
    const fieldsArray = impFields.map(i => this.state[i]);
    if (fieldsArray.includes("")) {
      return true
    } else {
      return false
    }
  }

  render() {
    console.log("this.state.status", this.state.status)
    return (
      <div>
        <header className='navbar'>
          <div className='navbar__title'> NGK</div>
          <div className='navbar__item'>
            {
              this.state.status !== "update" ?
                <Link to={'/'} style={{ textDecoration: 'none', color: 1 == 1 ? 'blue' : '#D3D3D3' }}>
                  Form
           </Link>
                :
                <Link style={{ textDecoration: 'none', color: 'blue' }}>
                  Form
              </Link>
            }
          </div>
          <div className='navbar__item'><Link to="/user" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'user' ? 'blue' : '#D3D3D3' }}>Entries</Link></div>
          <div className='navbar__item'><Link to="/profile" style={{ textDecoration: 'none', color: window.location.pathname.split("/")[1] === 'profile' ? 'blue' : '#D3D3D3' }}>Profile</Link></div>
        </header>

        <Container component="main" maxWidth="sm">
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="VehicleNumber"
            value={this.state.VehicleNumber}
            disabled={this.state.status === "update" ? true : false}
            label="Vehicle Number"
            onChange={(e) => this.setState({ VehicleNumber: e.target.value })}
          />
          {this.validateInput('Vehicle Number', this.state.VehicleNumber)}
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="InsuranceCompany"
            value={this.state.InsuranceCompany}
            label="Insurance Company"
            onChange={(e) => this.setState({ InsuranceCompany: e.target.value })}
          />
          {this.validateInput('Insurance Company', this.state.InsuranceCompany)}
          <TextField variant="outlined"
            fullWidth
            margin="normal"
            id="date"
            label="Insurance Upto"
            type="date"
            min="2019-06-02"
            max="2019-06-08"
            value={this.state.InsuranceUpto}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ inputProps: { min: this.getCurrentDate() } }}
            onChange={(e) => this.setState({ InsuranceUpto: e.target.value })}
          />
          {this.validateDates('Insurance Upto', this.state.InsuranceUpto)}
          <TextField variant="outlined"
            fullWidth
            margin="normal"
            id="Fitness Upto"
            label="Fitness Upto"
            value={this.state.FitnessUpto}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ inputProps: { min: this.getCurrentDate() } }}
            onChange={(e) => this.setState({ FitnessUpto: e.target.value })}
          />
          {this.validateDates('Fitness Upto', this.state.FitnessUpto)}
          <TextField variant="outlined"
            fullWidth
            display='block'
            margin="normal"
            id="date"
            label="Tax Upto"
            type="date"
            min="2019-06-02"
            max="2019-06-08"
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state.TaxUpto}
            InputProps={{ inputProps: { min: this.getCurrentDate() } }}
            onChange={(e) => this.setState({ TaxUpto: e.target.value })}
          />
          {this.validateDates('Tax Upto', this.state.TaxUpto)}
          <TextField variant="outlined"
            fullWidth
            display='block'
            margin="normal"
            id="Pollution Upto"
            label="Pollution Upto"
            type="date"
            value={this.state.PollutionUpto}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ inputProps: { min: this.getCurrentDate() } }}
            onChange={(e) => this.setState({ PollutionUpto: e.target.value })}
          />
          {this.validateDates('Pollution Upto', this.state.PollutionUpto)}
          <div style={{ textAlign: 'center', marginTop: '20px', }}>
            <Button
              type="button"
              style={{ width: '250px', backgroundColor: !this.setNextBtn() && 'blue', color: 'white' }}
              disabled={this.setNextBtn()}
              fullWidth
              variant="contained"
              onClick={() => this.handleSubmit()}
            >
              Submit
            </Button>
          </div>
        </Container>
      </div>
    )
  }
}

export default Home
