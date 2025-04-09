import { useCallback } from 'react';
import { BookingStepOrder } from '../app/constants/bookingSteps';

export const useStepNavigation = (currentStep, setCurrentStep) => {
  const currentIndex = BookingStepOrder.indexOf(currentStep);

  const next = useCallback(() => {
    if (currentIndex < BookingStepOrder.length - 1) {
      setCurrentStep(BookingStepOrder[currentIndex + 1]);
    }
  }, [currentIndex, setCurrentStep]);

  const back = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentStep(BookingStepOrder[currentIndex - 1]);
    }
  }, [currentIndex, setCurrentStep]);

  const goTo = useCallback((step) => {
    if (BookingStepOrder.includes(step)) {
      setCurrentStep(step);
    }
  }, [setCurrentStep]);

  return { next, back, goTo };
};
