import { Box, FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";

type Props = {
  timeSlice: string;
  timeSliceSet: { [key: string]: number };
  onTimeSliceChange: (key: string) => void;
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
            onTimeSliceChange(e.target.value as string);
          }}
        >
          <MenuItem value={"15min"}>15 min</MenuItem>
          <MenuItem value={"1hour"}>1 hour</MenuItem>
          <MenuItem value={"1day"}>1 day</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
