//initial state is an empty array
import { SET_ALERT, REMOVE_ALERT} from '../actions/types';

const initialState = []; 

//action
export default function(state =initialState, action){
    const {type, payload} = action;
    switch(type){
        case SET_ALERT: 
            //state is immutable and include any other state there
            return [...state, payload];
        case REMOVE_ALERT: 
            return state.filter(alert => alert.id !== payload);
        default: 
            return state;
    }
}
 
 