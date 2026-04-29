import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Globe, Activity } from 'lucide-react';

export default function DeploymentViz() {
  const [requests, setRequests] = useState<{ id: number, latency: number, status: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => {
        const newReq = { 
          id: Date.now(), 
          latency: Math.floor(Math.random() * 50) + 20,
          status: 200
        };
        return [newReq, ...prev].slice(0, 5);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Production Edge</h3>
          <p className="text-zinc-500 text-xs">Real-time API traffic monitoring for NOVA v1.0</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <div className="text-[10px] text-zinc-500 uppercase font-black">Uptime</div>
              <div className="text-green-400 font-mono font-bold">99.98%</div>
           </div>
           <Activity className="w-6 h-6 text-green-500 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* API Stats */}
        <div className="space-y-4">
           <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-[10px] text-zinc-500 uppercase font-black mb-1">Latency (Avg)</div>
              <div className="text-2xl font-black text-white font-mono">34ms <span className="text-xs text-green-500 font-normal">⚡ Fast</span></div>
           </div>
           <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-[10px] text-zinc-500 uppercase font-black mb-1">Throughput</div>
              <div className="text-2xl font-black text-white font-mono">1,248 <span className="text-xs text-zinc-500 font-normal">req/s</span></div>
           </div>
        </div>

        {/* Live Traffic Ticker */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 overflow-hidden h-48">
           <div className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-4">Incoming Requests</div>
           <div className="space-y-2">
              <AnimatePresence initial={false}>
                {requests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg border border-white/5 text-[10px] font-mono"
                  >
                    <div className="flex items-center gap-2">
                       <Globe className="w-3 h-3 text-blue-500" />
                       <span className="text-zinc-400">POST /predict</span>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-zinc-500">{req.latency}ms</span>
                       <span className="text-green-500">{req.status} OK</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 text-zinc-600">
         <Server className="w-4 h-4" />
         <div className="flex-1 h-px bg-zinc-800" />
         <span className="text-[10px] font-black uppercase tracking-widest">Region: Galactic-Alpha-1</span>
      </div>
    </div>
  );
}
