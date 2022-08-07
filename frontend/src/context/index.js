//Global Imports
import { createContext, useState } from 'react';

export const UserConfigContext = createContext({
  user: {},
  setUser: {}
});

export const UserDataContext = (props) => {
  const [user, setUser] = useState(null);
  const setHandleUser = (user) => {
    setUser(user);
  };

  const UserConfigValue = {
    user,
    setHandleUser
  };

  return (
    <UserConfigContext.Provider value={UserConfigValue}>
      {props.children}
    </UserConfigContext.Provider>
  );
};
