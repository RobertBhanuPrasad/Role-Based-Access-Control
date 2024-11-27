import React from "react";

interface IconComponentPropType {
  width?: number;
  height?: number;
  circleFill?: string;
  pathFill?: string;
}

const RedReverseIcon = ({

}: IconComponentPropType) => {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1176_8942)">
        <path d="M30 0.000122347C46.5685 0.000122347 60 13.4316 60 30C60 46.5685 46.5685 60 30 60C13.4316 60 0.000124436 46.5685 0.000124436 30C-0.0470201 13.4786 13.3079 0.0472669 29.8292 0.000122347C29.8862 -4.07825e-05 29.9431 -4.07825e-05 30 0.000122347Z" fill="#15AF53" />
        <path d="M46.6194 21.7327L25.3127 43.0394L13.3809 31.1929L18.2389 26.4202L25.3127 33.4088L41.7616 16.96L46.6194 21.7327Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1176_8942">
          <rect width="60" height="60" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );
};

export default RedReverseIcon;
