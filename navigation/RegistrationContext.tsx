import { createContext, useContext, useState } from 'react';
import { RegistrationData } from '@types';

interface RegistrationContextProps {
  registrationData: RegistrationData;
  setRegistrationData: (data: RegistrationData) => void;
}

const RegistrationContext = createContext<RegistrationContextProps | undefined>(
  undefined
);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
  });

  return (
    <RegistrationContext.Provider
      value={{ registrationData, setRegistrationData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      'useRegistration must be used within a RegistrationProvider'
    );
  }
  return context;
};
