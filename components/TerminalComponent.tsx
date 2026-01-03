import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { X } from 'lucide-react';

interface TerminalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const TerminalComponent: React.FC<TerminalComponentProps> = ({ isOpen, onClose, title = "System Console" }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (isOpen && terminalRef.current && !xtermRef.current) {
      const term = new Terminal({
        theme: {
          background: '#09090b',
          foreground: '#e4e4e7',
          cursor: '#f97316',
          selectionBackground: 'rgba(249, 115, 22, 0.3)'
        },
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        cursorBlink: true,
        convertEol: true,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Welcome message
      term.writeln('\x1b[1;38;5;208mOrenGen Nexus System Interface v2.5.0\x1b[0m');
      term.writeln('Initializing connection to secure enclave...');
      term.writeln('Access granted. Welcome, Super Admin.');
      term.write('\r\n$ ');

      // Simple Echo Logic
      let currentLine = '';
      term.onData(e => {
        switch (e) {
          case '\r': // Enter
            term.write('\r\n');
            if (currentLine.trim() === 'help') {
              term.writeln('Available commands: help, status, deploy, logs, exit');
            } else if (currentLine.trim() === 'exit') {
               onClose();
            } else if (currentLine.trim() !== '') {
              term.writeln(`\x1b[31mCommand not found: ${currentLine}\x1b[0m`);
            }
            term.write('$ ');
            currentLine = '';
            break;
          case '\u007F': // Backspace
            if (currentLine.length > 0) {
              term.write('\b \b');
              currentLine = currentLine.substring(0, currentLine.length - 1);
            }
            break;
          default:
            term.write(e);
            currentLine += e;
        }
      });
    }
    
    // Resize observer
    if (isOpen && fitAddonRef.current) {
        // Allow a tick for layout
        setTimeout(() => fitAddonRef.current?.fit(), 100);
    }
    
    return () => {
        // Cleanup if necessary, though strictly we might want to keep the session alive
        // For this demo, we can dispose on close if we want a fresh terminal every time
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-3/4 h-3/4 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-sm font-mono text-zinc-400">{title}</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 p-2 bg-[#09090b] relative">
           <div ref={terminalRef} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};