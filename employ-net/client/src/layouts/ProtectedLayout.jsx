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

function ProtectedLayout() {

    const { user, setUser } = useContext(usercontext);

    const [userDataLoaded, setUserDataLoaded] = useState(false);

    useEffect(() => {
        console.log("Checking local storage in protected layout");
        const userStored = localStorage.getItem("user");

        if (userStored) {
            console.log("User found in local storage", userStored);
            setUser(JSON.parse(userStored));
            console.log("User set to", JSON.parse(userStored));
        }

        setUserDataLoaded(true);
    }, []);

    if (!userDataLoaded) {
        return <div>Loading...</div>;
    }


    if (user) {
        return (

            <div>
                <Outlet />
            </div>
        )
    }
    else {
       
        return <Navigate to="/" />; 
        
    }

}

export default ProtectedLayout
