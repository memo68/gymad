import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {Route,RouteProps,Redirect} from 'react-router-dom';

import { RootState } from '../../../store';

interface Props extends RouteProps {
    component: any;
}

const PrivateRoute: FC<Props> = ({component: Component, ...rest }) => {
    const { authenticate } = useSelector((state: RootState) => state.auth);

    return(
        <Route {...rest} render={props => authenticate ? <Component {...props} /> : <Redirect to="/signin" /> } />
    )
}
