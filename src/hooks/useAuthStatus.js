import { useEffect, useRef, useState } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuthStatus = () => {
  // assume user to be logged out
  const [loggedIn, setLoggedIn] = useState(false);

  // keep track to display a spinner while auth status is being checked
  const [checkingStatus, setCheckingStatus] = useState(true);
  // memory leak warning 을 막기위해
  const _isMounted = useRef(true);

  useEffect(() => {
    if (_isMounted) {
      const auth = getAuth();
      // auth listener to keep track of user signing in and out
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }

        setCheckingStatus(false);
      });
    }

    return () => {
      _isMounted.current = false;
    };
  }, [_isMounted]);

  return { loggedIn, checkingStatus };
};
export default useAuthStatus;
