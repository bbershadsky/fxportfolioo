"use client";
import type React from "react";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sessionValue: string;
  setSessionValue: React.Dispatch<React.SetStateAction<string>>;
  idValue: string;
  setIdValue: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  setOpen,
  sessionValue,
  setSessionValue,
  idValue,
  setIdValue,
}) => {
  // Temporary state while editing
  const [tempSession, setTempSession] = useState(sessionValue);
  const [tempId, setTempId] = useState(idValue);

  if (!open) return null;

  const handleSave = () => {
    // Update parent states
    setSessionValue(tempSession);
    setIdValue(tempId);

    // Persist to localStorage
    localStorage.setItem("myfx_session_override", tempSession);
    localStorage.setItem("myfx_id_override", tempId);

    // Close modal
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="p-6 w-[300px] rounded-md bg-white dark:bg-neutral-800 shadow-xl relative">
        <h2 className="text-xl mb-4 font-semibold">Override Env Values</h2>

        {/* Session */}
        <label htmlFor="session" className="block text-sm font-medium mb-1">
          Session:
        </label>
        <input
          id="session"
          type="text"
          value={tempSession}
          onChange={(e) => setTempSession(e.target.value)}
          className="mb-2 w-full p-2 border rounded-md dark:bg-neutral-900 dark:border-neutral-700"
        />

        {/* Account ID */}
        <label htmlFor="accId" className="block text-sm font-medium mb-1">
          Account ID:
        </label>
        <input
          id="accId"
          type="text"
          value={tempId}
          onChange={(e) => setTempId(e.target.value)}
          className="mb-4 w-full p-2 border rounded-md dark:bg-neutral-900 dark:border-neutral-700"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
