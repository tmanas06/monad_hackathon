/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ApplicationDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultRent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  defaultRent?: number;
}) {
  const [desiredRent, setDesiredRent] = useState(defaultRent?.toString() || "");
  const [moveInDate, setMoveInDate] = useState("");
  const [applicationText, setApplicationText] = useState("");

  const handleSubmit = () => {
    onSubmit({
      desiredRent: desiredRent ? Number(desiredRent) : null,
      moveInDate,
      applicationText
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Rental Application</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Desired Rent (₹)</label>
            <Input
              type="number"
              value={desiredRent}
              onChange={(e) => setDesiredRent(e.target.value)}
              placeholder={`Current: ₹${defaultRent?.toLocaleString()}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Move-in Date</label>
            <Input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Application Letter</label>
            <Textarea
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
              placeholder="Tell the landlord about yourself, employment status, and rental history"
              rows={4}
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            className="w-full bg-black text-white rounded-xl"
          >
            Submit Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
