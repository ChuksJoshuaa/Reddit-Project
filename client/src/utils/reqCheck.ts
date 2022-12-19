export const ReqChecker = ({ userAgent }: any) => {
  let result = undefined;
  if (userAgent === undefined || userAgent === null) {
    return result;
  } else {
    return (result = userAgent);
  }
};

ReqChecker.getInitialProps = async ({ req }: any) => {
  const userAgent: string = req.headers.cookie;
  return { userAgent };
};
