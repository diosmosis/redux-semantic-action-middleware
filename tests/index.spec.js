'use strict'

import { expect } from 'chai'
import semanticActionMiddleware from '../lib'

describe('action class middleware', function () {

    const syncAction = {
        make: function () {
            return {
                type: syncAction
            }
        }
    }

    let actionPromise = null
    beforeEach(function () {
        actionPromise = null
    })

    const asyncAction = {
        make: function (value) {
            return {
                type: asyncAction,
                value: value
            }
        },
        run: function (action, dispatch) {
            dispatch({id: action.value + 1})

            actionPromise = new Promise(function (resolve, reject) {
                dispatch({id: action.value + 2})

                setTimeout(function () {
                    dispatch({id: action.value + 3})

                    resolve()
                }, 100)
            })
        }
    }

    let dispatchedActions
    beforeEach(function () {
        dispatchedActions = []
    })

    function mockDispatch(action) {
        dispatchedActions.push(action)
    }

    let middleware = null
    beforeEach(function () {
        middleware = semanticActionMiddleware({dispatch: mockDispatch})
    })

    it("should dispatch actions without execute methods correctly", function () {
        let actionHandler = middleware(makeMockNext(5))

        let action = syncAction.make()
        let result = actionHandler(action)

        expect(dispatchedActions).to.have.length(1)
        expect(Object.is(dispatchedActions[0], action)).to.be.true;

        expect(result).to.equal(5)
    })

    it("should dispatch actions with execute methods that dispatch other actions correctly", function * () {
        let actionHandler = middleware(makeMockNext(6))

        let firstAction = asyncAction.make(100)
        let result = actionHandler(firstAction)

        expect(actionPromise).to.be.instanceof(Promise)

        yield actionPromise

        expect(dispatchedActions).to.have.length(4)
        expect(Object.is(dispatchedActions[0], firstAction)).to.be.true;
        expect(dispatchedActions[1]).to.deep.equal({id: 101})
        expect(dispatchedActions[2]).to.deep.equal({id: 102})
        expect(dispatchedActions[3]).to.deep.equal({id: 103})

        expect(result).to.equal(6)
    })

    function makeMockNext(returnValue) {
        return function (action) {
            mockDispatch(action)

            return returnValue
        }
    }
})
