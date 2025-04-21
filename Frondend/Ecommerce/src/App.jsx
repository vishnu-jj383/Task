import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";


import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./components/Accounts/Login";
import Signup from "./components/Accounts/Signup";

import TaskList from "./components/Task/List";
import Add from "./components/Task/Add";
 import Edit from "./components/Task/Edit";
 import View from "./components/Task/View";

import TaskDashboard from "./components/Task/TaskDashboard";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/dashboard",
      element: <TaskDashboard />,
    },
   
    {
      path: "/createtask",
      element: <Add />,
    },
    
    {
      path: "/Lists",
      element: <TaskList />,
    },

    {
      path: "/tasks/edit/:id",
      element:  <Edit /> ,
    },
    {
      path: "/tasks/view/:id",
      element:  <View /> ,
    },
   
    
  ]);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />;
    </Provider>
  );
}

export default App;
