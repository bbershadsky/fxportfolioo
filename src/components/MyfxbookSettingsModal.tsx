import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import React from 'react';
// import { Label } from "@/components/ui/label";

interface MyfxbookSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (session: string, accountId: string) => void;
  defaultSession?: string;
  defaultAccountId?: string;
}

export function MyfxbookSettingsModal({
  open,
  onOpenChange,
  onSave,
  defaultSession,
  defaultAccountId,
}: MyfxbookSettingsModalProps) {
  const [session, setSession] = React.useState(defaultSession || '');
  const [accountId, setAccountId] = React.useState(defaultAccountId || '');

  const handleSave = () => {
    onSave(session, accountId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>MyFxBook Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            {/* <Label htmlFor="session">Session ID</Label> */}
            <Input
              id="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              placeholder="Enter MyFxBook session"
            />
          </div>
          <div className="grid gap-2">
            {/* <Label htmlFor="accountId">Account ID</Label> */}
            <Input
              id="accountId"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="Enter MyFxBook account ID"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}