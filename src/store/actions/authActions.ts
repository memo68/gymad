import { RootState } from './../index';
import { SIGN_OUT, AuthAction } from './../types';
import { Type } from './../../../node_modules/.staging/protobufjs-a4b6962c/index.d';
import { ThunkAction } from 'redux-thunk';
import {SignUpData,AuthAction,SET_USER,User,SET_LOADING,SIGN_OUT,SignIndata,SET_ERROR,NEED_VERIFICATION,SET_SUCCESS} from '../types';

import {RootState} from '..';
import firebase from '../../firebase/config';

//Crea el usuario
export const signup = (data: SignUpData, onError: ()=>void): ThunkAction<void,RootState,null,AuthAction> => {
    return async dispatch => {
        try{
            const res = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
            if (res.user){
                const userData: User = {
                    email: data.email,
                    nombre: data.firstName,
                    id : res.user.uid,
                    createdAT: firebase.firestore.FieldValue.serverTimestamp()
                };
                await firebase.firestore().collection('/usuarios').doc(res.user.uid).set(userData);
                await res.user.sendEmailVerification();
                dispatch({
                    type: NEED_VERIFICATION
                });
                dispatch({
                    type: SET_USER,
                    payload: userData
                });
            }
        } catch (error) {
            let message = "";
            if (error instanceof Error) message = error.message
            var qerr = message;
            console.log(error);
            onError();
            dispatch({
                type: SET_ERROR,
                payload: message
            });
        }
    }
}

export const getUserById = (id:string): ThunkAction<void,RootState,null,AuthAction> => {
    return async dispatch => {
        try{
            const user = await firebase.firestore().collection('usuarios').doc(id).get();
            if (user.exists){
                const userData = user.data() as User;
                dispatch({
                    type: SET_USER,
                    payload: userData
                });
            }
        } catch (err) {
            console.log(err);
        }
        
    }
}

export const setLoading = (value:boolean): ThunkAction<void,RootState,null,AuthAction> => {
    return dispatch => {
        try{
           dispatch({
             type: SET_LOADING,
             payload: value
           });
        } catch (err) {
            console.log(err);
        }
    }
}

export const sigin = (data: SignIndata, onError: () => void): ThunkAction<void,RootState,null,AuthAction> => {
    return async dispatch => {
        try{
            await firebase.auth().signInWithEmailAndPassword(data.email,data.password);
        }catch (error){
            let message = "";
            if (error instanceof Error) message = error.message
            var qerr = message;
            console.log(error);
            
            onError();
            dispatch(setError(message));
        }
    }
}

export const signout = (): ThunkAction<void,RootState,null,AuthAction> => {
    return async dispatch => {
        try {
            dispatch(setLoading(true));
            await firebase.auth().signOut();
            dispatch({
                type: SIGN_OUT
            });
        }catch (err) {
            console.log(err);
            dispatch(setLoading(false));
        }
    }
}

export const setError = (msg: string): ThunkAction<void,RootState,null,AuthAction> => {
    return dispatch => {
        dispatch({
            type: SET_ERROR,
            payload: msg
        });
    }
}

export const setNeedVerification = (): ThunkAction<void,RootState,null,AuthAction> => {
    return dispatch => {
        dispatch({
            type: NEED_VERIFICATION
        });
    }
}

export const setSuccess = (msg: string): ThunkAction<void,RootState,null,AuthAction> => {
    return dispatch => {
        dispatch({
            type: SET_SUCCESS,
            payload: msg
        })
    }
}

export const sendPasswordResetEmail = (email:string, successMsg: string): ThunkAction<void,RootState,null,AuthAction> => {
    return async dispath => {
        try{
            await firebase.auth().sendPasswordResetEmail(email);
            dispath(setSuccess(successMsg));
        }catch (error) {
            let message = "";
            if (error instanceof Error) message = error.message            
            console.log(error);            
            dispath(setError(message));
        }
    }
}