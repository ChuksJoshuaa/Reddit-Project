import React from "react";
import { Footer, Wrapper } from "./index";
import { WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
  children: any;
}

const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <Wrapper variant={variant}>{children}</Wrapper>
      <Footer />
    </>
  );
};

export default Layout;
