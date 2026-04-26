"use client";

import { useState } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock, Database, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Badge, Button, Card } from "@/components/ui";
import { syncStatus } from "@/lib/demo-data";

export default function SyncPage() {
  const [status, setStatus] = useState<"idle" | "syncing" | "success">("idle");
  const [progress, setProgress] = useState(100);
  const [logs, setLogs] = useState([
    { id: 1, type: "success", text: "Цены и остатки обновлены", time: "19:42:10" },
    { id: 2, type: "info", text: "Проверено 1 240 товаров", time: "19:42:08" },
    { id: 3, type: "info", text: "Соединение с центральной базой активно", time: "19:42:01" },
  ]);

  const handleSync = () => {
    setStatus("syncing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          setStatus("success");
          setLogs((currentLogs) => [
            { id: Date.now(), type: "success", text: "Демо-обновление завершено: цены, остатки и скидки актуальны", time: new Date().toLocaleTimeString("ru-RU") },
            ...currentLogs,
          ]);
          return 100;
        }
        return current + 10;
      });
    }, 100);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-indigo-600 p-3 text-white">
          <Database className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Контроль обновления склада</h1>
          <p className="text-slate-500">Экран контроля актуальности цен и остатков на витрине.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="relative flex flex-col items-center justify-center overflow-hidden p-8 text-center md:col-span-2">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-100">
            <motion.div className="h-full bg-indigo-600" animate={{ width: `${progress}%` }} />
          </div>

          <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            status === "syncing" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
          }`}>
            <RefreshCcw className={`h-10 w-10 ${status === "syncing" ? "animate-spin" : ""}`} />
          </div>

          <h2 className="mb-2 text-2xl font-black text-slate-800">
            {status === "syncing" ? `Обновление: ${progress}%` : "Данные на сайте актуальны"}
          </h2>
          <p className="mb-8 max-w-md text-slate-500">
            Последнее обновление: {syncStatus.lastSync}. Система автоматически синхронизирует остатки с основным складом.
          </p>

          <Button size="lg" className="w-full max-w-xs gap-2" onClick={handleSync} disabled={status === "syncing"}>
            <RefreshCcw className="h-4 w-4" />
            Запустить демо-обновление
          </Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Показатели обмена</h3>
            <div className="space-y-4">
              <Metric icon={<Clock className="h-4 w-4" />} label="Регламент" value={syncStatus.interval} />
              <Metric icon={<ArrowUpRight className="h-4 w-4" />} label="Товаров" value={`${syncStatus.productsUpdated.toLocaleString("ru-RU")} шт`} />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <AlertTriangle className="h-4 w-4" /> Ошибки
                </span>
                <Badge variant="success">0 за 24ч</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Лог событий</h3>
            <div className="max-h-48 space-y-3 overflow-y-auto pr-2">
              {logs.map((log) => (
                <div key={log.id} className="border-l-2 border-slate-100 py-1 pl-3 text-xs">
                  <div className="mb-1 flex justify-between text-slate-400">
                    <span>{log.time}</span>
                    {log.type === "success" && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                  </div>
                  <p className="font-medium text-slate-700">{log.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-slate-600">
        {icon} {label}
      </span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
