import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { 
  Terminal as TerminalIcon, Type, Maximize, Minimize, 
  Trash2, Box, Cpu
} from 'lucide-react';

// Virtual File System Types
type FileSystemNode = {
  type: 'dir' | 'file';
  parent: string | null;
  content?: string; // Only for files
};

type FileSystem = Record<string, FileSystemNode>;

// Initial State
const INITIAL_FS: FileSystem = {
  '/': { type: 'dir', parent: null },
  '/root': { type: 'dir', parent: '/' },
  '/home': { type: 'dir', parent: '/' },
  '/home/nexus': { type: 'dir', parent: '/home' },
  '/home/nexus/projects': { type: 'dir', parent: '/home/nexus' },
  '/home/nexus/readme.md': { type: 'file', parent: '/home/nexus', content: '# OrenGen Nexus Terminal\n\nWelcome to your private operational environment.\nType "help" for commands.' },
  '/etc': { type: 'dir', parent: '/' },
  '/var': { type: 'dir', parent: '/' },
  '/bin': { type: 'dir', parent: '/' },
};

export const TerminalPage: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  
  // Terminal Configuration State
  const [fontSize, setFontSize] = useState(15);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [dimensions, setDimensions] = useState({ cols: 120, rows: 30 });
  
  // OS Simulation State
  const [fs, setFs] = useState<FileSystem>(INITIAL_FS);
  const [cwd, setCwd] = useState('/home/nexus');
  const [osName, setOsName] = useState('NexusOS');
  const [osVersion, setOsVersion] = useState('v1.0.0-rc1');
  const [kernel, setKernel] = useState('Linux 5.15.0-generic');
  const [hostname, setHostname] = useState('nexus-core');
  const [user, setUser] = useState('superadmin');
  
  // REPL State
  const [replMode, setReplMode] = useState<'SHELL' | 'NODE'>('SHELL');

  // Command History
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const currentInput = useRef('');

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Initialize xterm
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: fontSize,
      fontWeight: '500',
      theme: {
        background: '#0c0c0e',
        foreground: '#e4e4e7',
        cursor: '#f97316',
        selectionBackground: 'rgba(249, 115, 22, 0.3)',
        black: '#18181b',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#f4f4f5',
        brightBlack: '#52525b',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
      scrollback: 5000
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    // Initial Fit
    if (isAutoFit) setTimeout(() => fitAddon.fit(), 100);
    else term.resize(dimensions.cols, dimensions.rows);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Boot Sequence
    term.writeln('\x1b[38;5;240m[  OK  ] Mounted /dev/vda1 on filesystem root.\x1b[0m');
    term.writeln('\x1b[38;5;240m[  OK  ] Started Network Manager Service.\x1b[0m');
    term.writeln('\x1b[38;5;240m[  OK  ] Reached target Graphical Interface.\x1b[0m');
    term.writeln('');
    term.writeln(`\x1b[1;38;5;208m   ____  ____  _____ _   _ _____ _____ _   _ \x1b[0m`);
    term.writeln(`\x1b[1;38;5;208m  / __ \\|  _ \\| ____| \\ | | ____| ____| \\ | |\x1b[0m`);
    term.writeln(`\x1b[1;38;5;208m | |  | | |_) |  _| |  \\| | |  _|  _| |  \\| |\x1b[0m`);
    term.writeln(`\x1b[1;38;5;208m | |__| |  _ <| |___| |\\  | |_| | |___| |\\  |\x1b[0m`);
    term.writeln(`\x1b[1;38;5;208m  \\____/|_| \\_\\_____|_| \\_|\\_____|_____|_| \\_|\x1b[0m`);
    term.writeln('');
    term.writeln(`Welcome to ${osName} (${kernel} x86_64)`);
    term.writeln('System load: 0.02, 0.05, 0.01');
    term.writeln('Type \x1b[36mhelp\x1b[0m for available commands.');
    term.writeln('Type \x1b[35mnode\x1b[0m to enter JavaScript REPL.');
    
    printPrompt(term);

    // Keyboard Handling
    term.onKey(({ key, domEvent }) => {
      const charCode = domEvent.keyCode;

      // Enter
      if (charCode === 13) {
        term.write('\r\n');
        handleInput(currentInput.current, term);
        currentInput.current = '';
        // Note: prompt is handled inside handleInput
      } 
      // Backspace
      else if (charCode === 8) {
        if (currentInput.current.length > 0) {
           term.write('\b \b');
           currentInput.current = currentInput.current.slice(0, -1);
        }
      }
      // Arrow Up (History)
      else if (charCode === 38) {
         if (historyIndex.current < commandHistory.current.length - 1) {
             // Clear line
             while(currentInput.current.length > 0) {
                 term.write('\b \b');
                 currentInput.current = currentInput.current.slice(0, -1);
             }
             historyIndex.current++;
             const cmd = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
             term.write(cmd);
             currentInput.current = cmd;
         }
      }
      // Arrow Down
      else if (charCode === 40) {
          if (historyIndex.current > -1) {
             while(currentInput.current.length > 0) {
                 term.write('\b \b');
                 currentInput.current = currentInput.current.slice(0, -1);
             }
             historyIndex.current--;
             if (historyIndex.current >= 0) {
                 const cmd = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
                 term.write(cmd);
                 currentInput.current = cmd;
             }
          }
      }
      // Control + C (Interrupt)
      else if (domEvent.ctrlKey && key === '\u0003') {
          term.write('^C');
          term.write('\r\n');
          currentInput.current = '';
          if (replModeRef.current === 'NODE') {
              // Standard node behavior: pressing Ctrl+C twice to exit? 
              // Simpler: just print prompt
              term.write('> ');
          } else {
              printPrompt(term);
          }
      }
      // Normal keys
      else {
        if (!domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey) {
            term.write(key);
            currentInput.current += key;
        }
      }
    });

    // Resize Observer
    const ro = new ResizeObserver(() => {
        if (isAutoFit && fitAddonRef.current) fitAddonRef.current.fit();
    });
    ro.observe(terminalRef.current);

    return () => {
        ro.disconnect();
        term.dispose();
        xtermRef.current = null;
    };
  }, []); // Run once

  // State Refs
  const fsRef = useRef(fs);
  const cwdRef = useRef(cwd);
  const replModeRef = useRef(replMode);
  const osNameRef = useRef(osName);
  const userRef = useRef(user);
  const hostnameRef = useRef(hostname);

  // Sync refs
  useEffect(() => { fsRef.current = fs; }, [fs]);
  useEffect(() => { cwdRef.current = cwd; }, [cwd]);
  useEffect(() => { replModeRef.current = replMode; }, [replMode]);
  useEffect(() => { osNameRef.current = osName; }, [osName]);
  useEffect(() => { userRef.current = user; }, [user]);
  useEffect(() => { hostnameRef.current = hostname; }, [hostname]);

  useEffect(() => {
     if (xtermRef.current) xtermRef.current.options.fontSize = fontSize;
     if (xtermRef.current && isAutoFit && fitAddonRef.current) fitAddonRef.current.fit();
     if (xtermRef.current && !isAutoFit) xtermRef.current.resize(dimensions.cols, dimensions.rows);
  }, [fontSize, isAutoFit, dimensions]);

  const printPrompt = (term: Terminal) => {
      let p = cwdRef.current;
      if (p.startsWith('/home/nexus')) {
        p = p.replace('/home/nexus', '~');
      } else if (p.startsWith('/root') && userRef.current === 'root') {
        p = p.replace('/root', '~');
      }
      
      const symbol = userRef.current === 'root' ? '#' : '$';
      term.write(`\x1b[1;32m${userRef.current}@${hostnameRef.current}\x1b[0m:\x1b[1;34m${p}\x1b[0m${symbol} `);
  };

  const handleInput = async (input: string, term: Terminal) => {
     let trimmed = input.trim();
     
     if (trimmed) {
        commandHistory.current.push(trimmed);
        historyIndex.current = -1;
     }

     if (replModeRef.current === 'NODE') {
         handleNodeInput(trimmed, term);
         return;
     }

     if (!trimmed) {
         printPrompt(term);
         return;
     }

     // Handle sudo (simple simulation)
     if (trimmed.startsWith('sudo')) {
         const parts = trimmed.split(' ');
         if (parts[1] === '-i' || parts[1] === 'su') {
             setUser('root');
             setCwd('/root');
             term.writeln(''); 
             // We need to wait for state update in a real app, 
             // but here refs will be updated on next render. 
             // We manually update the ref for prompt immediately? 
             // The prompt uses userRef, which is updated via useEffect [user].
             // So we must manually pass the new user to printPrompt or wait.
             // Hack: Force update ref immediately for this cycle
             userRef.current = 'root';
             cwdRef.current = '/root';
             printPrompt(term);
             return;
         }
         // Strip sudo and run command as is (simulating root privs for that command)
         trimmed = parts.slice(1).join(' ');
         if (!trimmed) {
             term.writeln('usage: sudo -h | -K | -k | -V');
             printPrompt(term);
             return;
         }
     }

     const [cmd, ...args] = trimmed.split(' ');

     // Shell Commands
     switch (cmd) {
         case 'help':
             term.writeln('NexusOS Shell Commands:');
             term.writeln('  \x1b[36mls, cd, pwd\x1b[0m          File system navigation');
             term.writeln('  \x1b[36mmkdir, touch, rm\x1b[0m     File manipulation');
             term.writeln('  \x1b[36mcat, echo\x1b[0m            File content');
             term.writeln('  \x1b[36mwhoami, uname, date\x1b[0m  System info');
             term.writeln('  \x1b[36mhostname\x1b[0m             Show system hostname');
             term.writeln('  \x1b[36mapt, apt-get\x1b[0m         Package manager');
             term.writeln('  \x1b[36mnode\x1b[0m                 Start JavaScript Runtime');
             term.writeln('  \x1b[36mclear\x1b[0m                Clear terminal');
             term.writeln('  \x1b[36msudo\x1b[0m                 Execute as superuser');
             break;
         
         case 'clear':
             term.clear();
             break;

         case 'whoami':
             term.writeln(userRef.current);
             break;
        
         case 'hostname':
             term.writeln(hostnameRef.current);
             break;

         case 'pwd':
             term.writeln(cwdRef.current);
             break;
         
         case 'uname':
             if (args.includes('-a')) {
                 term.writeln(`Linux ${hostnameRef.current} 5.15.0-generic #42-Ubuntu SMP Tue Feb 23 12:45:00 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux`);
             } else {
                 term.writeln('Linux');
             }
             break;
         
         case 'date':
             term.writeln(new Date().toString());
             break;

         case 'ls':
             const currentNodes = Object.keys(fsRef.current).filter(path => {
                 const node = fsRef.current[path];
                 return node.parent === cwdRef.current;
             });
             const names = currentNodes.map(p => {
                 const name = p.split('/').pop();
                 const isDir = fsRef.current[p].type === 'dir';
                 return isDir ? `\x1b[1;34m${name}\x1b[0m` : name;
             }).join('  ');
             term.writeln(names);
             break;

         case 'cd':
             if (!args[0] || args[0] === '~') {
                 setCwd(userRef.current === 'root' ? '/root' : '/home/nexus');
             } else if (args[0] === '..') {
                 const parent = fsRef.current[cwdRef.current]?.parent;
                 if (parent) setCwd(parent);
             } else {
                 const target = args[0].startsWith('/') ? args[0] : `${cwdRef.current === '/' ? '' : cwdRef.current}/${args[0]}`;
                 if (fsRef.current[target] && fsRef.current[target].type === 'dir') {
                     setCwd(target);
                 } else {
                     term.writeln(`cd: no such file or directory: ${args[0]}`);
                 }
             }
             break;
        
         case 'cat':
             const fileTarget = args[0].startsWith('/') ? args[0] : `${cwdRef.current === '/' ? '' : cwdRef.current}/${args[0]}`;
             if (fsRef.current[fileTarget] && fsRef.current[fileTarget].type === 'file') {
                 term.writeln(fsRef.current[fileTarget].content || '');
             } else {
                 term.writeln(`cat: ${args[0]}: No such file or directory`);
             }
             break;
        
         case 'mkdir':
             if (args[0]) {
                 const newDir = args[0].startsWith('/') ? args[0] : `${cwdRef.current === '/' ? '' : cwdRef.current}/${args[0]}`;
                 setFs(prev => ({ ...prev, [newDir]: { type: 'dir', parent: cwdRef.current } }));
             } else {
                 term.writeln('mkdir: missing operand');
             }
             break;

         case 'touch':
             if (args[0]) {
                 const newFile = args[0].startsWith('/') ? args[0] : `${cwdRef.current === '/' ? '' : cwdRef.current}/${args[0]}`;
                 setFs(prev => ({ ...prev, [newFile]: { type: 'file', parent: cwdRef.current, content: '' } }));
             } else {
                 term.writeln('touch: missing operand');
             }
             break;
        
         case 'rm':
             if (args[0]) {
                 const rmTarget = args[0].startsWith('/') ? args[0] : `${cwdRef.current === '/' ? '' : cwdRef.current}/${args[0]}`;
                 if (fsRef.current[rmTarget]) {
                     const newFs = { ...fsRef.current };
                     delete newFs[rmTarget];
                     setFs(newFs);
                 } else {
                     term.writeln(`rm: cannot remove '${args[0]}': No such file or directory`);
                 }
             } else {
                 term.writeln('rm: missing operand');
             }
             break;
        
         case 'node':
             setReplMode('NODE');
             setReplMode((prev) => {
                 replModeRef.current = 'NODE'; // Force ref update for prompt
                 return 'NODE';
             });
             term.writeln('Welcome to Node.js v20.11.0.');
             term.writeln('Type ".help" for more information.');
             term.write('> ');
             return; // Don't print shell prompt
        
         case 'install': // Easter egg alias
         case 'apt':
         case 'apt-get':
             if (args[0] === 'install') {
                 const pkg = args[1];
                 if (pkg === 'ubuntu-24.04' || pkg === 'ubuntu') {
                     await simulateInstall(term, 'Ubuntu 24.04 LTS (Noble Numbat)');
                     setOsName('Ubuntu');
                     setOsVersion('24.04');
                     setHostname('ubuntu-nexus');
                 } else if (pkg) {
                     await simulateInstall(term, pkg);
                 } else {
                     term.writeln('apt: missing argument');
                 }
             } else {
                 term.writeln('apt: invalid operation');
             }
             break;
         
         case 'exit':
             if (userRef.current === 'root') {
                 setUser('superadmin');
                 setCwd('/home/nexus');
                 term.writeln('logout');
                 userRef.current = 'superadmin'; // Immediate update for prompt
                 cwdRef.current = '/home/nexus';
             } else {
                 term.writeln('logout');
                 // Maybe close window? For now just reset
                 term.writeln('Session terminated. Press Refresh to restart.');
                 return; 
             }
             break;

         default:
             term.writeln(`${cmd}: command not found`);
     }

     printPrompt(term);
  };

  const handleNodeInput = (input: string, term: Terminal) => {
      const trimmed = input.trim();
      
      // Exit commands
      if (['.exit', 'exit', 'quit', 'q'].includes(trimmed)) {
          setReplMode('SHELL');
          replModeRef.current = 'SHELL';
          printPrompt(term);
          return;
      }
      
      // Clear
      if (['clear', 'cls', '.clear'].includes(trimmed)) {
          term.clear();
          term.write('> ');
          return;
      }

      // Help
      if (trimmed === '.help') {
          term.writeln('.exit     Exit the REPL');
          term.writeln('.clear    Clear the screen');
          term.writeln('.help     Print this help message');
          term.write('> ');
          return;
      }
      
      try {
          // eslint-disable-next-line no-eval
          const result = eval(trimmed);
          if (result !== undefined) {
             term.writeln(`\x1b[33m${String(result)}\x1b[0m`);
          }
      } catch (e: any) {
          term.writeln(`\x1b[31mUncaught ${e.name}: ${e.message}\x1b[0m`);
          // Hint for confused users
          if (e.name === 'ReferenceError' && (trimmed.startsWith('sudo') || trimmed.startsWith('apt'))) {
             term.writeln('\x1b[90m(You are in the Node.js REPL. Type .exit to return to the shell)\x1b[0m');
          }
      }
      term.write('> ');
  };

  const simulateInstall = async (term: Terminal, pkgName: string) => {
      term.writeln(`Reading package lists... Done`);
      term.writeln(`Building dependency tree... Done`);
      term.writeln(`The following NEW packages will be installed:`);
      term.writeln(`  ${pkgName}`);
      term.writeln(`0 upgraded, 1 newly installed, 0 to remove.`);
      term.writeln(`Need to get 145 MB of archives.`);
      term.writeln(`After this operation, 450 MB of additional disk space will be used.`);
      
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
          const progress = i * 10;
          const bar = '='.repeat(i) + ' '.repeat(steps - i);
          term.write(`\r[${bar}] ${progress}% `);
          await new Promise(r => setTimeout(r, 200));
      }
      term.write('\r\n');
      term.writeln(`Selecting previously unselected package ${pkgName}.`);
      term.writeln(`(Reading database ... 24591 files and directories currently installed.)`);
      term.writeln(`Preparing to unpack .../${pkgName} ...`);
      term.writeln(`Unpacking ${pkgName} ...`);
      await new Promise(r => setTimeout(r, 800));
      term.writeln(`Setting up ${pkgName} ...`);
      term.writeln(`Processing triggers for man-db (2.10.2-1) ...`);
      term.writeln(`\x1b[32mInstallation complete.\x1b[0m`);
      if (pkgName.includes('Ubuntu')) {
          term.writeln('\x1b[1;35mSystem Reboot Required. Simulation OS Kernel Updated.\x1b[0m');
      }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-[#0c0c0e]">
      {/* Controls Header */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-6 backdrop-blur-md">
         <div className="flex items-center gap-4">
            <TerminalIcon className="text-orange-500 w-5 h-5" />
            <h2 className="font-bold text-white tracking-wide">{osName.toUpperCase()} TERMINAL</h2>
            <div className="h-4 w-px bg-zinc-700 mx-2" />
            <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Cpu size={14} className={replMode === 'NODE' ? 'text-green-500 animate-pulse' : 'text-zinc-600'} />
                <span>{replMode === 'NODE' ? 'Node.js Runtime Active' : 'Shell Idle'}</span>
            </div>
         </div>

         <div className="flex items-center gap-3">
             {/* Dimension Controls */}
             {!isAutoFit && (
                 <div className="flex items-center gap-2 mr-2 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1">
                     <span className="text-xs text-zinc-500 uppercase font-mono">Size</span>
                     <input 
                       type="number" 
                       value={dimensions.cols}
                       onChange={(e) => setDimensions(prev => ({...prev, cols: parseInt(e.target.value)}))}
                       className="w-12 bg-transparent text-xs text-white text-center focus:outline-none"
                     />
                     <span className="text-zinc-600">x</span>
                     <input 
                       type="number" 
                       value={dimensions.rows}
                       onChange={(e) => setDimensions(prev => ({...prev, rows: parseInt(e.target.value)}))}
                       className="w-12 bg-transparent text-xs text-white text-center focus:outline-none"
                     />
                 </div>
             )}

             <button 
                onClick={() => setIsAutoFit(!isAutoFit)}
                className={`p-1.5 rounded-md transition-colors ${isAutoFit ? 'bg-orange-500/20 text-orange-500' : 'text-zinc-400 hover:text-white'}`}
                title={isAutoFit ? "Auto Fit: On" : "Auto Fit: Off (Manual Size)"}
             >
                {isAutoFit ? <Maximize size={18} /> : <Minimize size={18} />}
             </button>

             <div className="h-4 w-px bg-zinc-700 mx-1" />

             {/* Font Size */}
             <div className="flex items-center gap-1 bg-zinc-800 rounded-md p-1">
                <button 
                  onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
                >
                   <Type size={14} className="scale-75" />
                </button>
                <span className="text-xs font-mono w-6 text-center text-zinc-300">{fontSize}</span>
                <button 
                  onClick={() => setFontSize(Math.min(32, fontSize + 1))}
                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
                >
                   <Type size={14} />
                </button>
             </div>

             <button 
                onClick={() => xtermRef.current?.clear()}
                className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors ml-2"
                title="Clear Console"
             >
                <Trash2 size={18} />
             </button>
         </div>
      </div>

      {/* Terminal Container */}
      <div className="flex-1 bg-[#0c0c0e] p-2 relative overflow-hidden">
         <div 
           id="terminal" 
           ref={terminalRef} 
           className="w-full h-full"
           style={{
              display: isAutoFit ? 'block' : 'flex',
              justifyContent: isAutoFit ? undefined : 'center',
              alignItems: isAutoFit ? undefined : 'center',
           }}
         />
      </div>
    </div>
  );
};
