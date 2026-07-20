import "./Section.css";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "gray" | "blue" | "dark";
}

function Section({ children, className = "", id, background = "gray" }: SectionProps) {
  return (
    <section className={`section section-bg-${background} ${className}`} id={id}>
      <div className="container">{children}</div>
    </section>
  );
}

export default Section;
