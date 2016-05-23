'use strict'

const semanticActionMiddleware = ({ dispatch, getState }) => next => action => {
    const result = next(action)

    if (action.type && action.type.run) {
        action.type.run(action, dispatch, getState)
    }

    return result
}

export default semanticActionMiddleware
