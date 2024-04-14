import React from "react";

const CmsLayout = (props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <div>
      {props.children}
      {props.modal}
    </div>
  );
};

export default CmsLayout;
