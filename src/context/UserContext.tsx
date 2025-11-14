import React, { createContext, useContext, useState } from "react";

interface UserContextType {
  is_po: boolean;
  is_unix: boolean;
  setIsPo: (isPo: boolean) => void;
  setIsUnix: (isUnix: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [is_po, setIsPo] = useState<boolean>(false);
  const [is_unix, setIsUnix] = useState<boolean>(false);


  const setIsPoHandler = (newIsPo: boolean) => {
    setIsPo(newIsPo);
  };

  const setIsUnixHandler = (newIsUnix: boolean) => {
    setIsUnix(newIsUnix);
  };

  return (
    <UserContext.Provider
      value={{
        is_po,
        is_unix,
        setIsPo: setIsPoHandler,
        setIsUnix: setIsUnixHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  return context;
}
