import React from "react";

const PromoLayout = (props: {
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

export default PromoLayout;
