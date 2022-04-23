import React from "react";

export const Note: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40px"
      height="40px"
      viewBox="0 0 20 20"
    >
      <path d="M14.971 9.438c-.422.656-.646.375-.52 0 .336-.993.348-4.528-2.451-4.969L11.998 16c0 1.657-1.735 4-4.998 4-1.657 0-3-.871-3-2.5 0-2.119 1.927-3.4 4-3.4 1.328 0 2 .4 2 .4V0h2c0 2.676 5.986 4.744 2.971 9.438z" />
    </svg>
  );
};

export const NoteBig: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35px"
      height="35px"
      viewBox="0 0 16 16"
    >
      <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
      <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
      <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
    </svg>
  );
};
