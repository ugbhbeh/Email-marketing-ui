import { useContext } from 'react';
import AuthContext from "../services/AuthContext";

export default function Home() {
    const { isLoggedIn } = useContext(AuthContext);
    
    return (
        <>
            {isLoggedIn ? (
                <p>hello world, logged in edition</p>
            ) : (
                <p>not logged in</p>
            )}
        </>
    );
}
