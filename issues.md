
## Issues

### Issue: The heading on the "Create Course" page displays as "Create Workshop"


#### Issue Description

Need to update the "Create Course" page header to display "Create Course" instead of "Create Workshop".

**Steps to Reproduce**

* Using the React client, click on the "Sign In" link displayed in the header to browse to the "Sign In" page.
* Sign in using Joe's user information.
  * Email Address: joe@smith.com
  * Password: joepassword
* From the Course List page (i.e. the "Home" page), click on the "New Course" card to browse to the Create Course page.
* Notice that the page heading displays as "Create Workshop".
  * The page heading should display as "Create Course".


### Issue: Creating a new course returns an unexpected HTTP status code

#### Issue Description

Creating a new course returns a `202 Accepted` HTTP status code instead of the expected `201 Created` HTTP status code. As described in bug #2, creating a new user is currently broken, so it's not possible to determine if the REST API is returning the correct HTTP status code when creating a new user.

When creating a new course from the React client, the "Error" page will be displayed because of the unexpected HTTP status code. Using Postman to test the REST API will allow you to see easily see what HTTP status code is being returned from the server.

**Steps to Reproduce**

* Using Postman, send a POST request to the REST API.
  * URL: `http://localhost:5000/api/courses`
  * Basic Auth Authorization Header: Username=joe@smith.com, Password=joepassword
  * Body (as JSON):
  
```javascript
{
    "title": "Another New Course",
    "description": "My course description",
    "user": "57029ed4795118be119cc437"
}
```

* The REST API returns a response with a `202 Accepted` HTTP status code.
  * The REST API should return a response with a `201 Created` HTTP status code.



### Issue: The placeholder text for the Sign In page's "Email Address" field is misspelled


#### Issue Description

On the Sign In page, the placeholder text for the "Email Address" field is misspelled as "Email Addrss".

**Steps to Reproduce**

* Using the React client, click on the "Sign In" link displayed in the header to browse to the "Sign In" page.
* Notice that the placeholder text for the "Email Address" field is misspelled as "Email Addrss".


### Issue: The "Materials Needed" section doesn't display on the Course Detail page


#### Issue Description

When viewing the [Build a Basic Bookcase](http://localhost:3000/courses/57029ed4795118be119cc440) course, the "Materials Needed" section doesn't display.

**Steps to Reproduce**

* Using the React client, browse to the "Build a Basic Bookcase" course's Course Detail page.
* Notice that the course's content for the "Materials Needed" section doesn't display.
  * You can use the [React Developer Tools](https://github.com/facebook/react-devtools) to confirm that the CourseDetail React component state contains an object whose `materialsNeeded` property is set to a non-null, non-empty value.


### Issue: Unable to delete a course


#### Issue Description

Attempting to delete a course doesn't produce an error on the server, but the course isn't deleted.

**Steps to Reproduce**

*Note: If you've changed any of the data since seeding the database, then you'll need to ensure that the course ID that's used below is still available or use a different course ID. If you use a different course, ensure that the user information provided for the authorization header is correct.*

* Using Postman, send a DELETE request to the REST API.
  * URL: `http://localhost:5000/api/courses/57029ed4795118be119cc440`
  * Basic Auth Authorization Header: Username=joe@smith.com, Password=joepassword
* The REST API returns a response with a `204 No Content` HTTP status code, indicating that the request succeeded.
* Send a GET request to the REST API.
  * URL: `http://localhost:5000/api/courses/57029ed4795118be119cc440`
* The REST API returns a response with a `200 OK` HTTP status code along with the course data in the body.
  * If the course was successfully deleted, we should receive a response with a `404 Not Found` HTTP status code. Receiving a `200 OK` HTTP status code indicates that there's an issue with deleting a course.



### Issue: Unable to create a new user


#### Issue Description

Attempting to create a new user produces the following validation error on the server:

```javascript
{
    "message": "Validation Failed",
    "errors": [
        "Cast to String failed for value \"Promise { <pending> }\" at path \"password\""
    ]
}
```

**Steps to Reproduce**

* Using Postman, send a POST request to the REST API.
  * URL: `http://localhost:5000/api/users`
  * Body (as JSON):
  
```javascript
{
  "firstName": "John",
  "lastName": "Smith",
  "emailAddress": "john@smith.com",
  "password": "password"
}
```

* The REST API returns a response with a `400 Bad Request` HTTP status code, indicating that the request failed.
  * If the user had been successfully created, we should have received a response with a `201 Created` HTTP status code.



### Issue: The Course `estimatedTime` property doesn't persist to the database


#### Issue Description

Posting the following course data to the server creates a new course in the database, but the `estimatedTime` property is missing in the persisted data:

```javascript
{
    "title": "Another New Course",
    "description": "My course description",
    "user": "57029ed4795118be119cc437",
    "estimatedTime": "2 hours"
}
```

**Steps to Reproduce**

* Using Postman, send a POST request to the REST API.
  * URL: `http://localhost:5000/api/courses`
  * Basic Auth Authorization Header: Username=joe@smith.com, Password=joepassword
  * Body (as JSON):
  
```javascript
{
    "title": "Another New Course",
    "description": "My course description",
    "user": "57029ed4795118be119cc437",
    "estimatedTime": "2 hours"
}
```

* The REST API returns a response with a HTTP status code in the `200` range, indicating that the request succeeded.
  * *Note: This bug has a dependency on [Issue: Creating a new course returns an unexpected http status code](#issue-creating-a-new-course-returns-an-unexpected-http-status-code). If that issue hasn't been resolved yet, then the REST API will return a `202 Accepted` HTTP status code. If that issue has been resolved, then the REST API will return a `201 Created` HTTP status code.*
* Send a GET request to the REST API.
  * URL: `http://localhost:5000/api/courses/[new course ID]`
  * *Note: The new course ID can be found in the POST response's `Location` header.*
* The REST API returns a response with a `200 OK` HTTP status code along with the course data in the body:
.
```javascript
{
  "data": [
    {
      "_id": "5c79874a6f2c05014bec019e",
      "title": "Another New Course",
      "description": "My course description",
      "user": {
        "_id": "57029ed4795118be119cc437",
        "firstName": "Joe",
        "lastName": "Smith",
        "emailAddress": "joe@smith.com"
      }
    }
  ]
}
```

Notice that the `estimatedTime` property that was provided in the POST request body isn't part of the course data returned from the GET request.


### Issue: Attempting to update a course produces an error


#### Issue Description

Attempting to update a course results in the "Error" page being displayed.

**Steps to Reproduce**

* Using the React client, click on the "Sign In" link displayed in the header to browse to the "Sign In" page.
* Sign in using Joe's user information.
  * Email Address: joe@smith.com
  * Password: joepassword
* Browse to the Course Detail page for the "Build a Basic Bookcase" course.
* Click the "Update Course" button at the top of the page to browse to the Update Course page.
* Click the "Update Course" button at the bottom of the page to update the course.
  * You can optionally change one of the field values, though the error occurs whether or not a field value has been changed. 
* The Error page displays instead of the expected Course Detail page.




