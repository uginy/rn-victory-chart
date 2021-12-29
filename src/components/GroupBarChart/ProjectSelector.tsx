import { Box, FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";

type Props = {
  project: string;
  projectList: { id: string; name: string }[];
  onProjectChange: (key: string) => void;
};
export const ProjectSelector = ({
  project,
  projectList,
  onProjectChange,
}: Props) => {
  return (
    <Box sx={{ minWidth: 220 }}>
      <FormControl style={{ width: "100%" }}>
        <InputLabel
          id="select-projects"
          style={{ backgroundColor: "#f1f1f1", paddingRight: 7 }}
        >
          Select Project
        </InputLabel>
        <Select
          defaultValue=""
          labelId="select-projects"
          id="projects"
          value={project}
          label="Project"
          onChange={(e: SelectChangeEvent) =>
            onProjectChange(e.target.value as string)
          }
        >
          <MenuItem value={"all"}>All Projects</MenuItem>
          {projectList.map((el) => (
            <MenuItem key={el.id} value={el.id}>
              {el.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
