import React, { useEffect } from "react"
import { connect } from "react-redux"
import { fetchUser } from "../store/actions/user.action"

function List ({ user, dispatch }) {
    useEffect(() => {
        dispatch(fetchUser())
    }, [])

    return (
        <div>
            users: 
            <ul>
                {user.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    )
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(List)
