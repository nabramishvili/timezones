import {
    LOADING_UI,
} from '../types';
import {axios_main as axios} from "../../common/instances";

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
};
