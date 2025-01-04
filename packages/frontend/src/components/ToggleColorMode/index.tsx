import { Box, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { useTheme } from '../../context/themeContext';

export default function ToggleColorMode() {
  const { mode, toggleTheme } = useTheme();

  return (
    <Box>
      <FormControl>
        <RadioGroup
          value={mode}
          onChange={(e) => toggleTheme(e.target.value as 'light' | 'dark' | 'system')}
        >
          <FormControlLabel value="system" control={<Radio />} label="System" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}