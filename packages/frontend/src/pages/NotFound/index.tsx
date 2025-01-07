import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './index.css'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="not-found">
      <span>
        <Button
          variant="text"
          color="primary"
          size='large'
        onClick={() => navigate(-1)}>
          <ArrowBackIcon />
          Go Back
        </Button>
      </span>
      <h1>404 Not Found</h1>
    </section>
  );
};  

export default NotFound;
