import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E5E7EB] transition-all duration-200 ${
        hoverEffect
          ? 'hover:border-[#F26A21]/40 hover:shadow-cardHover hover:-translate-y-0.5'
          : 'shadow-card'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
