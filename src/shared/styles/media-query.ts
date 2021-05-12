import { useMediaQuery } from "@material-ui/core";

export const useMobileMQ = () => useMediaQuery("max(max-width: 650px)");
export const useLargeMQ = () => useMediaQuery("max(max-width: 1000px)");
