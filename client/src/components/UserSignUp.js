import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
import FormField from './FormField';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <FormField 
                  fieldName="firstName" 
                  label="First Name" 
                  value={firstName} 
                  handleChange={this.change} />
                <FormField 
                  fieldName="lastName" 
                  label="Last Name" 
                  value={lastName} 
                  handleChange={this.change} />
                <FormField 
                  fieldName="emailAddress" 
                  label="Email Address" 
                  value={emailAddress} 
                  handleChange={this.change} />
                <FormField 
                  type="password"
                  fieldName="password" 
                  label="Password" 
                  value={password} 
                  handleChange={this.change} />
                <FormField 
                  type="password"
                  fieldName="confirmPassword" 
                  label="Confirm Password" 
                  value={confirmPassword} 
                  handleChange={this.change} />
              </React.Fragment>
            )} />
          <p>&nbsp;</p>
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    const { context } = this.props;
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
    } = this.state;

    // Validate that the passwords match.
    if (password !== confirmPassword) {
      this.setState(() => {
        return {
          errors: [ 'Make sure that your "Password" and "Confirm Password" values match' ]
        };
      });
    } else {
      const user = {
        firstName,
        lastName,
        emailAddress,
        password,
      };

      context.data.createUser(user)
        .then((errors) => {
          if (errors.length) {
            this.setState(() => {
              return { errors };
            });
          } else {
            // After creating the user it's necessary to sign in the user
            // which retrieves the user from the API in order to obtain the user ID, 
            // which is used elsewhere in the app to determine if a course 
            // is owned by the authenticated user.
            context.actions.signIn(emailAddress, password)
              .then(() => {
                this.props.history.push('/');    
              });
          }
        })
        .catch(() => {
          this.props.history.push('/error');
        });
    }
  }

  cancel = () => {
    this.props.history.push('/');
  }
}
