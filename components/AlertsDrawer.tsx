'use client';

import React from 'react';
import {
  X,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Terminal,
} from 'lucide-react';
import { MetricAlert, Incident } from '@/types/devpulse';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MetricAlert[];
  incident: Incident;
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
}

export function AlertsDrawer({
  isOpen,
  onClose,
  alerts,
  incident,
  onAcknowledgeAlert,
  onResolveAlert,
}: AlertsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-slate-900 text-sm">System Alerts & Incidents</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Active Incident */}
          {incident && incident.status !== 'resolved' && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-800 font-mono">[{incident.severity}] Active Incident</span>
                <span className="text-xs text-rose-600 uppercase font-semibold">{incident.status}</span>
              </div>
              <h4 className="font-semibold text-rose-950 text-xs sm:text-sm">{incident.title}</h4>
              <p className="text-rose-800">{incident.impact}</p>
            </div>
          )}

          {/* Metric Alerts */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-xs block">
              Active Alerts ({alerts.filter((a) => a.status !== 'resolved').length})
            </span>

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold px-1.5 py-0.5 rounded text-xs capitalize ${
                      alert.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : alert.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-slate-400 font-mono">{alert.time}</span>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-900">{alert.title}</h5>
                  <p className="text-slate-500 font-mono">{alert.service}</p>
                </div>

                <div className="text-slate-600 font-mono">
                  Current: <span className="font-bold text-slate-900">{alert.value}</span> (Threshold: {alert.threshold})
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                  {alert.status === 'active' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded font-medium"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
