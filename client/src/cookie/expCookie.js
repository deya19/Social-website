import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';



// Custom Hook to check if the token has expired
export const useIsTokenExpired = () => {
  const [isExpired, setIsExpired] = useState(false);
  const token = Cookies.get("accessToken");
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      logout();
      setIsExpired(true);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        setIsExpired(true);
      }
    } catch (err) {
      setIsExpired(true);
    }
  }, [logout, token]);

  return isExpired;
};
