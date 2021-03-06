import React, { Fragment, useState } from "react";
// import axios from 'axios'
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import { setAlert } from '../../actions/alert';
import { PropTypes } from 'prop-types';
import { register } from '../../actions/auth';

 
const Register = ({setAlert, register, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;
  //we want to change the state with this.

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({name, email, password});
      
      //access of the backend
      // //new user
      // const newUser = {
      //   name,
      //   email,
      //   password
      // }
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   }
      //   //recreate the config body to send
      //   const body = JSON.stringify(newUser);
      //   //
      //   const res = await axios.post('/api/users', body, config) ;
      //   console.log(res.data);
      // } catch (err) {
      //   console.error(err.response.data)
      // }


    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            // required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={e => onChange(e)}
            value={email}
            // required
          />

          <small className="form-text">
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            // minlength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            minlength="6"
            value={password2}
            onChange={e => onChange(e)}
            name="password2"
          />
        </div>
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated

});

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}
export default connect(mapStateToProps, 
  { setAlert, register })(Register);
