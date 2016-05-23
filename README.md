# redux-semantic-action-middleware

Redux middleware that lets you define actions as meaningful units, without OOP.

## Description

This is redux middleware that lets you define & run asynchronous actions in a way that
aligns the semantics of those objects with the code used to represent them.

It treats all actions as potentially asynchronous and does not use both functions & objects
to represent them. All actions are objects (asynchronous objects have to have a `.run()` property).

Additionally, the action type is an object and not a string.

It is different from other middleware (like redux-thunk), in that it does not conflate the concept
of a stateful action object with a thunk that is meant to be executed, but never shown to reducers.

In other words, IMO, it provides better separation of concerns and results in code that more
accurately represents the intent of its author.

_It is also different from middleware like redux-action-class-middleware in that it doesn't use ES6 classes
(a virtue to some)._

**Reasons to use this instead of alternatives**

- You don't like treating functions that reducers never see in the same way as objects reducers do see.
- You don't like naming factory functions after the actions themselves. (ie, `function myAction()` which creates the actual action).
- You don't like ES6 classes.

**Reasons not to use this instead of alternatives**

- You don't like having to write the extra code.
- You like using switch statements in reducers instead of using reference equality.
- You think creating an object or class to encapsulate the concept of a particular action is the same as creating a function that returns the action object.

It's a toss-up. Go with your gut.

## Example

```
// sync action with no extra logic
const todosFetched = {
    make: function (issues) {
        return {type: todosFetched, issues: issues}
    }
}

// async action that starts an AJAX request to get the TODO entities
const fetchTodos = {
    make: function () {
        return {type: fetchTodos}
    },
    run: function(action, dispatch) {
        API.fetchTodos().then(function (issues) {
            dispatch(todosFetched.make(issues))
        })
    }
}

let reducer = function (state, action) {
    if (action.type == fetchTodos) {
        return Object.assign({}, state, {loading: true})
    }

    if (action.type == todosFetched) {
        return Object.assign({}, state, {issues: action.issues, loading: false})
    }

    return state
}
```
