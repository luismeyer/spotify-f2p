import { useCallback, useEffect, useState } from "react";
import { size } from "../styles";

export const useIsDevice = (device: keyof typeof size) => {
  const widthString = size[device];
  const width = Number(widthString.replace("px", ""));

  const calc = () => window.innerWidth >= width;

  const [isDevice, setIsDevice] = useState(calc);

  const updateWidth = useCallback(() => {
    setIsDevice(calc());
  }, [setIsDevice]);

  useEffect(() => {
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth]);

  return isDevice;
};
