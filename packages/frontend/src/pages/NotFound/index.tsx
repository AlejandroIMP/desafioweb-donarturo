import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <span>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </span>
      <h1>404 Not Found</h1>
    </>
  );
};  

export default NotFound;
