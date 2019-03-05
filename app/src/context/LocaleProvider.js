import React, {Component} from 'react';

const Context = React.createContext();

export default props =>
    <Context.Provider
        value={{locale: props.locale}}>
        {props.children}
    </Context.Provider>

export const withLocalization = Component =>
    (props) => <Context.Consumer>
        {context => <Component
            {...props}
            locale={context.locale}
        />}
    </Context.Consumer>