import { Link } from 'react-router-dom';

const buttonVariants = {
  default: 'rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  primary: 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
  secondary: 'text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800',
  ghost: 'btn-ghost'
};

const Button = ({ 
  children, 
  variant = 'default',
  to, 
  onClick,
  className,
  ...props 
}) => {
  const classes = `${buttonVariants.default} ${buttonVariants[variant]} ${className || ''}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;