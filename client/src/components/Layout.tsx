import React from "react";
import Wrapper, { WrapperVariant } from "./Wrapper";
interface LayoutProps {
  variant?: WrapperVariant;
  children: any;
}

const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital@1&family=Lobster+Two&family=Cormorant+Garamond:wght@300&family=Racing+Sans+One&family=Rajdhani:wght@500&family=Roboto+Mono:wght@100&display=swap"
        rel="stylesheet"
      ></link>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
