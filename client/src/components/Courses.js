import React, { Component } from 'react';
import CourseCard from './CourseCard';
import NewCourseCard from './NewCourseCard';

export default class Courses extends Component {
  state = {
    courses: []
  };
  
  componentDidMount() {
    const { context: { data }} = this.props;

    data.getCourses().then(data => this.setState({ courses: data }));
  }

  render() {
    return (
      <div className="bounds">
        {this.state.courses.map(course => 
          <CourseCard course={course} key={course._id} />
        )}
        <NewCourseCard />
      </div>
    );
  }
}
