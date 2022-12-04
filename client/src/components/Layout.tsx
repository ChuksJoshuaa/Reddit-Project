import React from "react";
import Wrapper, { WrapperVariant } from "./Wrapper";
import { Navbar } from ".";

interface LayoutProps {
  variant?: WrapperVariant;
  children: any;
}

const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
