import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChevronDownIcon } from "../../icons"; // Assuming GridIcon or similar exists

const BranchSwitcher: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter out duplicates if a user has multiple roles in the same branch
  const branches = user?.roleAssignments?.reduce((acc, curr) => {
    if (curr.branchId && !acc.find(b => b.branchId === curr.branchId)) {
      acc.push(curr);
    }
    return acc;
  }, [] as typeof user.roleAssignments) || [];

  if (branches.length <= 1) {
    return null; // Don't show switcher if there's only 1 or 0 branches
  }

  const currentBranchId = user?.wardId || branches[0]?.branchId; // legacy wardId acts as current branchId

  const handleSelectBranch = (branchId: string) => {
    updateUser({ wardId: branchId });
    setIsOpen(false);
    // Optionally trigger a reload to fetch new branch data
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
      >
        <span className="truncate max-w-[120px]">
          Branch {currentBranchId ? currentBranchId.slice(-4) : "Default"}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-gray-900 py-1">
          <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Switch Branch</div>
          <ul className="flex flex-col">
            {branches.map((b) => (
              <li key={b.branchId}>
                <button
                  onClick={() => handleSelectBranch(b.branchId!)}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-left ${
                    currentBranchId === b.branchId
                      ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400 font-medium"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  Branch {b.branchId!.slice(-4)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BranchSwitcher;
