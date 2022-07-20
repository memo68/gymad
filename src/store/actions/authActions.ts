import { ThunkAction } from 'redux-thunk';
import {SignUpData,AuthAction,SET_USER,User,SET_LOADING,SIGN_OUT,SignIndata,SET_ERROR,NEED_VERIFICATION,SET_SUCCESS} from '../types';

import {RootState} from '..';
import firebase from '../../firebase/config';

//Crea el usuario
export const signup = (data: SignUpData, onError: ()=>void): ThunkAction<void,RootState,null,AuthAction> => {
    return async dispatch => {
        try{
            const res = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
            
        }
    }
}


