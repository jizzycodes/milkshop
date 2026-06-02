import { useFranchiseInquiry } from "../context/FranchiseInquiryContext";

/** Button that opens the franchise application popup (no navigation / scroll). */
export default function FranchiseInquiryTrigger({
  children,
  className,
  style,
  preferredPackage,
  ...rest
}) {
  const { open } = useFranchiseInquiry();

  const handleClick = (e) => {
    e.preventDefault();
    open(preferredPackage ? { preferredPackage } : undefined);
  };

  return (
    <button
      type="button"
      className={className}
      style={{
        border: "none",
        cursor: "pointer",
        font: "inherit",
        textAlign: "inherit",
        ...style,
      }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
