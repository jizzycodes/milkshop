const TAB_LABELS = {
  all: "All Leads",
  new: "Register",
  active: "Active",
  for_follow_up: "For Follow Up",
  orientation: "Orientation",
  onboarding: "Onboarding",
  dropped: "Dropped",
  archived: "Archived",
};

export default function StageTabs({ value, onChange, tabs: customTabs }) {
  const tabs =
    customTabs && customTabs.length
      ? customTabs
      : [
          "all",
          "new",
          "active",
          "for_follow_up",
          "orientation",
          "onboarding",
          "dropped",
          "archived",
        ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-150 ${
              active
                ? "border-[#5A9216] bg-[#5A9216] text-white shadow-sm"
                : "border-[#DDE8CF] bg-white text-[#5A6B4A] hover:border-[#C8DFA8] hover:bg-[#EEF5E6] hover:text-[#1A2410]"
            }`}
          >
            {TAB_LABELS[tab] || tab}
          </button>
        );
      })}
    </div>
  );
}