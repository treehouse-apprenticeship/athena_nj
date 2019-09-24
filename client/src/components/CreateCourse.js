import React, { Component } from 'react';
import Form from './Form';
import FormField from './FormField';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  }

  render() {
    const { context } = this.props;

    const {
      title,
      description,
      materialsNeeded,
      estimatedTime,
      errors,
    } = this.state;

    const {
      firstName,
      lastName,
    } = context.authenticatedUser;

    return (
      <div className="bounds course--detail">
        <h1>Create Workshop</h1>
        <Form 
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Create Course"
          elements={() => (
            <React.Fragment>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <FormField 
                    fieldName="title" 
                    label="Course title..." 
                    value={title} 
                    handleChange={this.change}
                    className="input-title course--title--input" />
                  <p>By {firstName} {lastName}</p>
                </div>
                <div className="course--description">
                  <FormField 
                    type="textarea"
                    fieldName="description" 
                    label="Course description..." 
                    value={description} 
                    handleChange={this.change} />
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <FormField 
                        fieldName="estimatedTime" 
                        label="Hours" 
                        value={estimatedTime} 
                        handleChange={this.change}
                        className="course--time--input" />
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <FormField 
                        type="textarea"
                        fieldName="materialsNeeded" 
                        label="List materials..." 
                        value={materialsNeeded} 
                        handleChange={this.change} />
                    </li>
                  </ul>
                </div>
              </div>
            </React.Fragment>
          )} />
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
    const course = this.state;
    const { context: { data } } = this.props;

    data.createCourse(course)
      .then((errors) => {
        if (errors.length) {
          this.setState(() => {
            return { errors };
          });
        } else {
          this.props.history.push('/');
        }
      })
      .catch(() => {
        this.props.history.push('/error');
      });
  }

  cancel = () => {
    this.props.history.push('/');
  }
}
