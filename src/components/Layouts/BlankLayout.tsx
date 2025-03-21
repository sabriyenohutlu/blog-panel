import { ReactNode } from "react";

type BlankLayoutProps = {
    children: ReactNode;
  }

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
  return (
 
      <div className="text-black dark:text-white-dark min-h-screen">
        {children}
      </div>
  
  );
};

export default BlankLayout;