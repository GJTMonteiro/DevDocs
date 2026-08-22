import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
