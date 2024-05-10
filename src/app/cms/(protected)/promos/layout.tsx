import React from "react";

const PromoLayout = (props: {
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

export default PromoLayout;
