/**
 * Stub for shared-utils/src/scanner
 * Replaces the real scanner API with a prototype-friendly mock.
 * In production, replace Vite alias with the real shared-utils package.
 */

export interface Scanner {
  deviceHasCamera: () => Promise<boolean>;
  deviceHasScanner: () => Promise<boolean>;
  onScan: (callback: (sscc: string) => void) => void;
  onCamera: (callback: (sscc: string) => void) => void;
}

let _scanCallback: ((sscc: string) => void) | null = null;
let _cameraCallback: ((sscc: string) => void) | null = null;

/**
 * Simulate a scan from outside (call this from dev tools or a button).
 * Example: window.__simulateScan('123456789012345678')
 */
function simulateScan(sscc: string) {
  if (_cameraCallback) {
    _cameraCallback(sscc);
    _cameraCallback = null;
  } else if (_scanCallback) {
    _scanCallback(sscc);
  }
}

// Expose on window for prototype testing
if (typeof window !== 'undefined') {
  (window as any).__simulateScan = simulateScan;
}

export default function useScanner(): Scanner {
  return {
    deviceHasCamera: () => Promise.resolve(true),
    deviceHasScanner: () => Promise.resolve(false),
    onScan: (callback) => {
      _scanCallback = callback;
    },
    onCamera: (callback) => {
      _cameraCallback = callback;
      // Auto-simulate scan after 2 seconds (prototype behaviour)
      setTimeout(() => {
        const mockSscc = '007300' + String(Date.now()).slice(-12);
        if (_cameraCallback) {
          _cameraCallback(mockSscc);
          _cameraCallback = null;
        }
      }, 2000);
    },
  };
}
