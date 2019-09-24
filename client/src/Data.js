import config from './config';

export default class Data {
  constructor() {
    this.authenticatedUser = null;
    this.authenticatedUserPassword = null;
  }

  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      // mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
  
    if (body !== null) {
      options.body = JSON.stringify(body);
    }
  
    if (requiresAuth) {
      if (credentials === null) {
        credentials = {
          emailAddress: this.authenticatedUser.emailAddress,
          password: this.authenticatedUserPassword,
        };
      }
  
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
  
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
  
    return fetch(url, options);
  }

  getUser(emailAddress, password) {
    return this.api(`/users`, 'GET', null, true, { emailAddress, password })
      .then(response => {
        if (response.status === 200) {
          return response.json().then(data => {
            return data.data[0];
          });
        } else if (response.status === 401) {
          return null;
        } else {
          throw new Error();
        }
      });
  }
  
  createUser(user) {
    return this.api('/users', 'POST', user)
      .then((response) => {
        if (response.status === 201) {
          return [];
        } else if (response.status === 400) {
          return response.json().then(data => {
            return data.errors;
          });
        } else {
          throw new Error();
        }
      });
  }

  getCourses() {
    return this.api('/courses')
      .then(response => {
        return response.json().then(data => {
          return data.data;
        });
      });
  }
  
  getCourse(id) {
    return this.api(`/courses/${id}`)
      .then(response => {
        if (response.status === 200) {
          return response.json().then(data => {
            return data.data[0];
          });
        } else if (response.status === 404) {
          return null;
        } else {
          throw new Error();
        }
      });
  }
  
  createCourse(course) {
    return this.api('/courses', 'POST', course, true)
      .then((response) => {
        if (response.status === 201) {
          return [];
        } else if (response.status === 400) {
          return response.json().then(data => {
            return data.errors;
          });
        } else {
          throw new Error();
        }
      });
  }
  
  updateCourse(course) {
    return this.api(`/courses/${course._id}`, 'GET', course, true)
      .then((response) => {
        if (response.status === 204) {
          return [];
        } else if (response.status === 400) {
          return response.json().then(data => {
            return data.errors;
          });
        } else {
          throw new Error();
        }
      });
  }
  
  deleteCourse(id) {
    return this.api(`/courses/${id}`, 'DELETE', null, true)
      .then((response) => {
        if (response.status === 204) {
          return null;
        } else {
          throw new Error();
        }
      });
  }
}
