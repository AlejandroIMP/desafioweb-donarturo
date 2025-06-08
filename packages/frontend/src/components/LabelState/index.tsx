import { formattedState } from "@/utils/orderUtils";

interface LabelStateProps {
  estados: number;
}

const LabelState = ({ estados }: LabelStateProps) => {
  // Determine status type for proper aria labeling
  const isActive = estados === 1 || estados === 7 || estados === 8;
  const isPending = estados === 3;
  const statusType = isActive ? 'active' : isPending ? 'pending' : 'inactive';
  const statusText = formattedState(estados);
  
  return (
      <span 
        className={`product-status ${statusType}`}
        role="status"
        aria-label={`Estado: ${statusText}`}
      >
        {statusText}
      </span>
  );
};

export default LabelState;