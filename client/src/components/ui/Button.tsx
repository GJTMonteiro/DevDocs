import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import './Button.css';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';

type ButtonSize =
  | 'small'
  | 'medium'
  | 'large';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`button button-${variant} button-${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;