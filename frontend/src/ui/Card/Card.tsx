import "./Card.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

function Card({ children, className = "", onClick, hoverable = true }: CardProps) {
  return (
    <div
      className={`card ${hoverable ? "card-hoverable" : ""} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
    </div>
  );
}

export default Card;