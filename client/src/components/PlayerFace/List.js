import React from "react";
import "./List.css";

export const List = ({ children }) => {
  return (
    <div className="d-flex playerFaceContainer justify-content-around">
        {children}
    </div>
  );
};
