import React from "react";

const Background = ({ children }: { children: React.ReactNode }) => {
  return <div className='h-screen pattern'>{children}</div>;
};

export default Background;
