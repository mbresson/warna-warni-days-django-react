import React from "react";

const ErrorsList: React.FC<{ errors: string[] }> = ({ errors }) => (
  <div className="bad-feeling">
    {errors.map((error, index) => (
      <p key={index}>{error}</p>
    ))}
  </div>
);

export default ErrorsList;
