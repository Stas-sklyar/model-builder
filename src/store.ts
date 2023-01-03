import { rootReducer } from './reducers/rootReducers'
import { applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from '@redux-devtools/extension'

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(),
  )
)