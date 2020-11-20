import {combineReducers} from 'redux'; 
import auth from './auth';
import profile from './profile'
import alert from './alert'

export default combineReducers({
     alert, 
     auth, 
     profile,

});  