import React from "react";

const CmsLayout = (props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <>
      {props.children}
      {props.modal}
    </>
  );
};

export default CmsLayout;
