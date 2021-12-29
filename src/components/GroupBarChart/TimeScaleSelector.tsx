import { Box, FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { ETimeSlice } from "./interface";

type Props = {
  timeSlice: ETimeSlice;
  timeSliceSet: { [key: string]: number };
  onTimeSliceChange: (key: ETimeSlice) => void;
};

export const TimeScaleSelector = ({ timeSlice, onTimeSliceChange }: Props) => {
  return (
    <Box sx={{ minWidth: 220 }}>
      <FormControl style={{ width: "100%" }}>
        <InputLabel
          id="select-timescale"
          style={{ backgroundColor: "#f1f1f1", paddingRight: 5 }}
        >
          Select TimeScale
        </InputLabel>
        <Select
          defaultValue=""
          labelId="select-timescale"
          id="timeslice"
          value={timeSlice}
          label="Time Slice"
          onChange={(e: SelectChangeEvent) => {
            onTimeSliceChange(e.target.value as ETimeSlice);
          }}
        >
          <MenuItem value={ETimeSlice["15m"]}>15 min</MenuItem>
          <MenuItem value={ETimeSlice["30m"]}>30 min</MenuItem>
          <MenuItem value={ETimeSlice["1h"]}>1 hour</MenuItem>
          <MenuItem value={ETimeSlice["3h"]}>3 hours</MenuItem>
          <MenuItem value={ETimeSlice["1d"]}>1 day</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
