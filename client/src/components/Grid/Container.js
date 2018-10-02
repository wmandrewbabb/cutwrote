import React from "react";

export const Container = ({ fluid, children, className }) => (
  <div className={`container${fluid ? "-fluid" : ""}${className ? " " + className : ""}`}>
    {children}
  </div>
);
