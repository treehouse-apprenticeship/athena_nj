import React, { Component } from 'react';
import Form from './Form';
import FormField from './FormField';

export default class UpdateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  }

  componentDidMount() {
    const { context, match: { params: { id }} } = this.props;

    context.data.getCourse(id)
      .then((course) => {
        if (course) {
          if (course.user._id === context.authenticatedUser._id) {
            this.setState({
              title: course.title,
              description: course.description,
              estimatedTime: course.estimatedTime,
              materialsNeeded: course.materialsNeeded,
            });  
          } else {
            this.props.history.push('/forbidden');
          }
        } else {
          this.props.history.push('/notfound');
        }
      })
      .catch(() => {
        this.props.history.push('/error');
      });
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
        <h1>Update Course</h1>
        <Form 
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Update Course"
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
    const { context: { data }, match: { params: { id }} } = this.props;

    course._id = id;

    data.updateCourse(course)
      .then((errors) => {
        if (errors.length) {
          this.setState(() => {
            return { errors };
          });
        } else {
          this.props.history.push(`/courses/${id}`);
        }
      })
      .catch(() => {
        this.props.history.push('/error');
      });
  }

  cancel = () => {
    const { match: { params: { id }} } = this.props;

    this.props.history.push(`/courses/${id}`);
  }
}
