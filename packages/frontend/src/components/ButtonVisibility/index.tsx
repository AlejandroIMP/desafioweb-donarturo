import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface ButtonVisibilityProps {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

const ButtonVisibility = ({ showPassword, togglePasswordVisibility }: ButtonVisibilityProps) => {

  return (
    <Button
      type="button"
      onClick={togglePasswordVisibility}
    >
      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon /> }
    </Button>
  );
};

export default ButtonVisibility;