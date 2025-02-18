import { formattedState } from "@/utils/orderUtils";

interface LabelStateProps {
  estados: number;
}

const LabelState = ({ estados }: LabelStateProps) => {
  return (
      <span className={`product-status ${estados === 1 || estados === 7 || estados === 8 ? 'status-active' : estados === 3 ? 'status-pending' : 'status-inactive'}`}>
        {formattedState(estados)}
      </span>
  );
};

export default LabelState;