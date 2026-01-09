import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { ChatPanel } from '@/components/ChatPanel';
import { AdminPanel } from '@/components/AdminPanel';
import { SafetyModal } from '@/components/SafetyModal';
import { mockSQLExamples } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header role={role} onRoleChange={setRole} />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel */}
          <div className={cn(
            'flex-1 flex flex-col border-r border-border/50 transition-all duration-300',
            role === 'admin' ? 'w-1/2' : 'w-full'
          )}>
            <ChatPanel />
          </div>

          {/* Admin Panel (only visible to admins) */}
          {role === 'admin' && (
            <div className="w-1/2 p-4 overflow-hidden animate-fade-in">
              <AdminPanel className="h-full" />
            </div>
          )}
        </div>
      </div>

      {/* Safety Modal */}
      <SafetyModal
        open={showSafetyModal}
        onOpenChange={setShowSafetyModal}
        sql={mockSQLExamples.delete}
        operationType="DELETE"
        affectedRows={1247}
        onConfirm={() => setShowSafetyModal(false)}
        onCancel={() => setShowSafetyModal(false)}
      />
    </div>
  );
};

export default Index;
