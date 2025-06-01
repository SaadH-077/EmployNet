import React, { useEffect } from 'react'
import { useContext } from 'react'
import { usercontext } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// This component is responsible for rendering the layout for protected routes.
// Within the component, it uses the useContext hook to access the user context.
// It also uses the useNavigate hook from React Router to handle navigation.
// The component checks if there is a user authenticated (i.e., user exists in the context).
// If there is a user, it renders the child components wrapped by the Outlet component, allowing nested routes to be rendered.
// If there is no user (i.e., user is not authenticated), it redirects the user to the '/' route using the Navigate component.

function EmployeeLayout() {

    const { user, setUser } = useContext(usercontext);

    
    if (user.Role === "employee") {
        return (

            <div>
                <Outlet />
            </div>
        )
    }
    else {
        console.log("User is not an employee")
        return <Navigate to="/" />; 
        
    }

}

export default EmployeeLayout
