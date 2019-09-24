import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext(); 

export class Provider extends Component {
  state = {
    authenticatedUser: null,
  };

  constructor() {
    super();
    this.data = new Data();
  }

  componentWillMount() {
    const authenticatedUser = Cookies.get('authenticatedUser');

    if (authenticatedUser) {
      this.setState(() => {
        return {
          authenticatedUser: JSON.parse(authenticatedUser),
        };
      });  
    }
  }

  render() {
    const {
      authenticatedUser,
    } = this.state;
    const authenticatedUserPassword = Cookies.get('authenticatedUserPassword');

    const isAuthenticated = authenticatedUser !== null;

    const data = this.data;
    data.authenticatedUser = authenticatedUser;
    data.authenticatedUserPassword = authenticatedUserPassword;

    const value = {
      authenticatedUser,
      authenticatedUserPassword,
      isAuthenticated,
      data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
      },
    };

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  signIn = (emailAddress, password) => {
    return this.data.getUser(emailAddress, password)
      .then((user) => {
        if (user !== null) {
          this.setState(() => {
            const cookieOptions = {
              // expires: 1/48,
            };
      
            Cookies.set('authenticatedUser', JSON.stringify(user), cookieOptions);
            Cookies.set('authenticatedUserPassword', password, cookieOptions);
      
            return {
              authenticatedUser: user,
            };
          });                
        }

        return user;
      });
  }

  signOut = () => {
    this.setState(() => {
      Cookies.remove('authenticatedUser');
      Cookies.remove('authenticatedUserPassword');
      
      return {
        authenticatedUser: null,
      };
    });
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */
export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
