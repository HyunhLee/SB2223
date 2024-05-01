//tooltip custom
import {styled} from "@mui/material/styles";
import Tooltip, {tooltipClasses, TooltipProps} from "@mui/material/Tooltip";
import React from "react";

export const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    backgroundColor: '#f5f5f5',
    color: 'rgba(0, 0, 0, 0.87)',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft:10,
    paddingRight: 10,
    marginLeft: 100,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color:'#f5f5f5',
    marginLeft: -50,
  },
});