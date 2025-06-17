import { NutritionGoals, UserProfile } from '@types';
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

export interface OnboardingState extends Partial<UserProfile> {
  onboardingStep: number;
}

type Action =
  | {
      type: 'UPDATE_FIELD';
      field: keyof OnboardingState;
      value: string | number | boolean | NutritionGoals;
    }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };

const initialState: OnboardingState = {
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
      console.log('next step', state);
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

  console.log('Onboarding context initialized', state);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
