import React from 'react';
import { DifficultyLevel } from '@/types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  };

  const variantStyles = {
    default: 'bg-[#F5F6F8] text-[#4B5563] border border-[#E5E7EB]',
    primary: 'bg-[#FFF1E8] text-[#D95614] border border-[#FED7AA]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: DifficultyLevel; size?: 'sm' | 'md' }> = ({
  difficulty,
  size = 'md',
}) => {
  switch (difficulty) {
    case 'easy':
      return <Badge variant="success" size={size}>ระดับง่าย</Badge>;
    case 'medium':
      return <Badge variant="warning" size={size}>ระดับปานกลาง</Badge>;
    case 'hard':
      return <Badge variant="danger" size={size}>ระดับท้าทาย</Badge>;
    default:
      return <Badge variant="default" size={size}>{difficulty}</Badge>;
  }
};
