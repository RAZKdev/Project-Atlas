import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-earth-400/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }[size];

  const variantClasses = {
    primary: "bg-earth-500 hover:bg-earth-600 text-parchment-100 shadow-sm",
    secondary: "bg-museum-card hover:bg-museum-hover text-parchment-200 border border-museum-border hover:border-earth-500/40",
    ghost: "bg-transparent hover:bg-white/5 text-parchment-300 hover:text-parchment-100",
    danger: "bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40"
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
