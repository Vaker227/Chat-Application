import React from "react";
import { Image } from "react-bootstrap";

function Avatar({ src, className, width, height }) {
  return (
    <div
      className={`${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div
        className="avatar w-100 h-100 rounded-circle"
        style={{ backgroundImage:`url(${src})` }}
      ></div>
    </div>
  );
}

export default Avatar;
