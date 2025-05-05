import React, { createContext, useReducer, useContext, ReactNode } from 'react';

interface OnboardingState {
  name: string;
  email: string;
  weight: number | null;
  gender: string;
  activityLevel: string;
  onboardingStep: number;
}

type Action =
  | {
      type: 'UPDATE_FIELD';
      field: keyof OnboardingState;
      value: string | number;
    }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };

const initialState: OnboardingState = {
  name: '',
  email: '',
  weight: null,
  gender: '',
  activityLevel: '',
  onboardingStep: 0,
};

const onboardingReducer = (
  state: OnboardingState,
  action: Action
): OnboardingState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'NEXT_STEP':
      return { ...state, onboardingStep: state.onboardingStep + 1 };
    case 'PREV_STEP':
      return { ...state, onboardingStep: state.onboardingStep - 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
