import { createContext, useEffect, useState } from "react";

// This component defines a user context using createContext from React.
// It also defines a UserProvider component that wraps its children with the user context provider.
// Within the UserProvider component, state variables for user, checkIn, and checkOut are initialized using useState.
// These state variables, along with their setter functions, are provided as values to the user context provider using the value prop.
// The children of the UserProvider component are rendered within the user context provider.

export const usercontext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const [checkInStatus, setCheckInStatus] = useState("");

    useEffect(() => {
        console.log("Syncing LS with context")
        //keep LS in sync with context
        localStorage.setItem("user", JSON.stringify(user));

    }, [user]);

    return (
        <usercontext.Provider
            value={{ user, setUser, checkInStatus, setCheckInStatus }}
        >
            {children}
        </usercontext.Provider>
    );
}

export default UserProvider;
