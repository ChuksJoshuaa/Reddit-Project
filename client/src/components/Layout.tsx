import React from "react";
import Wrapper, { WrapperVariant } from "./Wrapper";
interface LayoutProps {
  variant?: WrapperVariant;
  children: any;
}

const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
