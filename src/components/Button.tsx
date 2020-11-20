import React from "react";

const Button = ({
  children,
  disabled,
  className,
  ...rest
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  const disabledClasses = disabled ? 'cursor-not-allowed text-white opacity-50' : '';

  return (
    <button
      {...rest}
      className={`bg-blue-500 text-white active:bg-blue-600 font-thin md:font-bold 
      uppercase text-xs px-2 md:px-4 py-2 rounded shadow hover:shadow-md 
      outline-none focus:outline-none mr-1 mb-1  ${disabledClasses} ${className}`}
      type='button'
      style={{ transition: "all .15s ease" }}
    >
      {children}
    </button>
  );
};

export default Button;
