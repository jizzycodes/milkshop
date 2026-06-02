import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import FranchiseInquiryModal from "../components/FranchiseInquiryModal";

const FranchiseInquiryContext = createContext(null);

export function FranchiseInquiryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetPackage, setPresetPackage] = useState("");

  const open = useCallback((options) => {
    const pkg = options?.preferredPackage;
    setPresetPackage(typeof pkg === "string" ? pkg : "");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPresetPackage("");
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ open, close, isOpen, presetPackage }),
    [open, close, isOpen, presetPackage],
  );

  return (
    <FranchiseInquiryContext.Provider value={value}>
      {children}
      <FranchiseInquiryModal
        isOpen={isOpen}
        onClose={close}
        preferredPackage={presetPackage}
      />
    </FranchiseInquiryContext.Provider>
  );
}

export function useFranchiseInquiry() {
  const ctx = useContext(FranchiseInquiryContext);
  if (!ctx) {
    throw new Error("useFranchiseInquiry must be used within FranchiseInquiryProvider");
  }
  return ctx;
}
