import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {
  state = {
    course: null
  };

  componentDidMount() {
    const { context: { data }, match: { params: { id }} } = this.props;

    data.getCourse(id)
      .then((course) => {
        if (course) {
          this.setState({ course });
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
    const { course } = this.state;

    if (course) {
      return (
        <div>

          <div className="actions--bar">
            <div className="bounds">
              <div className="grid-100">
                {context.isAuthenticated && context.authenticatedUser._id === course.user._id &&
                  <span>
                    <a className="button" onClick={this.updateCourse}>Update Course</a>
                    <a className="button" onClick={this.deleteCourse}>Delete Course</a>
                  </span>
                }
                <a className="button button-secondary" onClick={this.returnToList}>Return to List</a>
              </div>
            </div>
          </div>

          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
                <p>By {course.user.firstName} {course.user.lastName}</p>
              </div>

              <div className="course--description">
                <ReactMarkdown source={course.description} />
              </div>
            </div>

            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  {course.estimatedTime &&
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{course.estimatedTime}</h3>
                    </li>
                  }
                  {course.materialsNeeded &&
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ReactMarkdown source={course.materials} />
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>

        </div>
      );
    } else {
      return <p>&nbsp;</p>;
    }
  }

  updateCourse = () => {
    this.props.history.push(`${this.props.match.url}/update`);
  }

  deleteCourse = () => {
    const { context: { data } } = this.props;

    if (window.confirm('Are you sure you want to delete this course?')) {
      data.deleteCourse(this.state.course._id)
        .then(() => {
          this.props.history.push('/');
        })
        .catch(() => {
          this.props.history.push('/error');
        });
    }
  }

  returnToList = () => {
    this.props.history.push('/');
  }
}
