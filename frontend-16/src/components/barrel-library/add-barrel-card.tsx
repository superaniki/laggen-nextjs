

import React, { forwardRef } from 'react';
import { Card } from '@nextui-org/react';

const AddBarrelCard = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Card>>((props, ref) => {
  return (
    <Card ref={ref} {...props}
      className="card mx-5 mb-10 fadeIn-animation border-2 border-dashed border-gray-300  flex items-center justify-center bg-gradient-to-t from-gray-50 to-gray-200 hover:from-gray-100 hover:to-gray-200"
    >
      <div className="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mb-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14m7-7H5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-gray-500 text-lg font-medium">Add New Barrel</span>
      </div>
    </Card>
  );
});

AddBarrelCard.displayName = 'AddBarrelCard';
export default AddBarrelCard;
