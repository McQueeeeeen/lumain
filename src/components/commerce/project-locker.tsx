"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Lock } from "lucide-react";

export function ProjectLocker({ 
  projectId, 
  userId, 
  initialLock 
}: { 
  projectId: string, 
  userId: string, 
  initialLock: { lockedBy: string, lockedAt: string } | null 
}) {
  const [lock, setLock] = useState(initialLock);

  useEffect(() => {
    if (lock && lock.lockedBy !== userId) {
      // Already locked by someone else
      return;
    }

    // Acquire/Renew lock
    const interval = setInterval(async () => {
      // In a real app, call a server action here to acquire/renew lock
      // await acquireProjectLock(projectId, userId);
    }, 1000 * 60 * 5); // every 5 minutes

    return () => clearInterval(interval);
  }, [projectId, userId, lock]);

  if (lock && lock.lockedBy !== userId) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-[2px] bg-red-50 p-4 border border-red-100 text-red-800">
        <AlertCircle size={20} />
        <div>
          <p className="font-bold">Проект заблокирован</p>
          <p className="text-sm">Этот проект сейчас редактирует другой пользователь. Ваши изменения могут не сохраниться.</p>
        </div>
      </div>
    );
  }

  return null;
}
