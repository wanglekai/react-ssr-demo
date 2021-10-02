import Axios from "axios"

export const SAVE_USER = "save_user"

export const fetchUser = () => async dispatch => {
    let response = await Axios.get('https://jsonplaceholder.typicode.com/users')

    dispatch({
        type: SAVE_USER,
        payload: response
    })
}
