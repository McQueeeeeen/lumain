"use client";

import { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";

export function ProjectComments({ 
  projectId, 
  initialComments 
}: { 
  projectId: string, 
  initialComments: any[] 
}) {
  const [comments, setComments] = useState(initialComments);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    // In a real app, call a server action here
    const comment = {
      id: Math.random().toString(),
      projectId,
      message: newMessage,
      authorType: "manager",
      createdAt: new Date().toISOString()
    };

    setComments([...comments, comment]);
    setNewMessage("");
  };

  return (
    <div className="rounded-[2px] border border-[rgba(166,106,63,0.12)] bg-white overflow-hidden">
      <div className="bg-[#FAF9F5] p-4 border-b border-[rgba(166,106,63,0.12)] flex items-center gap-2">
        <MessageSquare size={18} className="text-[#A66A3F]" />
        <h3 className="font-bold text-[#2D251E] text-sm uppercase tracking-widest">Обсуждение</h3>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {comments.map((c) => (
          <div key={c.id} className={`flex flex-col ${c.authorType === 'manager' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-[2px] p-3 text-sm ${
              c.authorType === 'manager' ? 'bg-[#2D251E] text-white' : 'bg-[#F1ECE4] text-[#2D251E]'
            }`}>
              {c.message}
            </div>
            <span className="text-[10px] text-[#766A5F] mt-1">
              {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[rgba(166,106,63,0.12)] flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 rounded-[2px] border border-[rgba(166,106,63,0.18)] px-3 py-2 text-sm focus:outline-none focus:border-[#A66A3F]"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="bg-[#A66A3F] text-white p-2 rounded-[2px] hover:bg-[#8E623E]"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
