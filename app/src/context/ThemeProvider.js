import React, {Component} from 'react';

const Context = React.createContext();

export default props =>
  <Context.Provider
    value={{theme: props.theme}}>
    {props.children}
  </Context.Provider>

export const withTheme = Component =>
  (props) => <Context.Consumer>
    {context => <Component
      {...props}
      theme={context.theme}
    />}
  </Context.Consumer>