import React from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SQLDisplay } from '@/components/SQLDisplay';

interface SafetyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sql: string;
  operationType: 'UPDATE' | 'DELETE';
  affectedRows?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  open,
  onOpenChange,
  sql,
  operationType,
  affectedRows = 0,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-destructive/20 max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl text-foreground">
                Destructive Operation Warning
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This {operationType} query will permanently modify your data
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-foreground">Impact Assessment</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This operation will affect approximately{' '}
                <span className="font-mono text-destructive font-semibold">
                  {affectedRows.toLocaleString()} rows
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">SQL Statement</h4>
            <SQLDisplay sql={sql} />
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Note:</strong> This action cannot be undone.
              Make sure you have a backup of your data before proceeding.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Execute {operationType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
