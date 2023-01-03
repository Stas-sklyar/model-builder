import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Model from "./pages/Model/Model"
import { store } from "./store"
import './index.css'
import Home from "./pages/Home/Home"
import './i18n'
import LoaderForSuspenseComponent from "./components/LoaderForSuspenseComponent/LoaderForSuspenseComponent"
import { Amplify } from 'aws-amplify'
import { s3Config } from "./s3Config"

Amplify.configure(s3Config)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/model/:modelId",
    element: <Model />
  }
])

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<LoaderForSuspenseComponent />}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
)