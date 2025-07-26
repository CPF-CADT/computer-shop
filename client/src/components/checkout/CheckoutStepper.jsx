import React from 'react';

const CheckoutStepper = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-around mb-8 px-4 py-3 bg-gray-50 rounded-md">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${index + 1 === currentStep ? 'bg-brand-orange border-brand-orange text-white' : ''}
                ${index + 1 < currentStep ? 'bg-green-500 border-green-500 text-white' : ''}
                ${index + 1 > currentStep ? 'border-gray-300 text-gray-500' : ''}
              `}
            >
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`mt-1 text-xs text-center
                ${index + 1 <= currentStep ? 'font-semibold text-brand-orange' : 'text-gray-500'}
                ${index + 1 < currentStep ? 'text-green-600' : ''}
              `}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-grow h-0.5 
              ${index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'}
              ${index + 1 === currentStep && index +1 < steps.length ? 'bg-brand-orange' : ''}
            `}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutStepper;