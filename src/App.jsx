const displaySteps = useMemo(
  () => [
    {
      key: 'student',
      title: 'Leerlinggegevens en aanleiding',
      shortTitle: 'Stap 1'
    },
    {
      key: 'tests',
      title: 'Toetsgegevens',
      shortTitle: 'Stap 2'
    },
    {
      key: 'context',
      title: 'Context en thuissituatie',
      shortTitle: 'Stap 3'
    },
    {
      key: 'observations',
      title: 'Observaties',
      shortTitle: 'Stap 4'
    },
    {
      key: 'review',
      title: 'Controle en disclaimer',
      shortTitle: 'Stap 5'
    },
    {
      key: 'results',
      title: 'Uitkomst',
      shortTitle: 'Stap 6'
    }
  ],
  []
);

const currentDisplayStep = useMemo(() => {
  if (isObservationPhase) return 3;
  if (currentStepConfig?.key === 'review') return 4;
  if (currentStepConfig?.key === 'results') return 5;
  return currentStep;
}, [currentStep, currentStepConfig, isObservationPhase]);