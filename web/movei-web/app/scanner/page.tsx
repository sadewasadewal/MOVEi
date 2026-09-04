'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_CINEMAS, MOCK_TICKETS } from '../../lib/mock-data';
import { validateAndAdmitTicket } from '../../services/scanner-service';
import { ScanResponse } from '../../types';
import { QrCode, Camera, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Smartphone, Search, MapPin } from 'lucide-react';

export default function ScannerPage() {
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>(MOCK_CINEMAS[0].id);
  const [manualCode, setManualCode] = useState<string>('');
  const [isScanningCamera, setIsScanningCamera] = useState<boolean>(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResponse | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<ScanResponse & { time: string }>>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Quick scan execution
  const executeScan = async (code: string) => {
    if (!code.trim() || isVerifying) return;
    setIsVerifying(true);

    try {
      const result = await validateAndAdmitTicket(
        code.trim(),
        'u3333333-3333-3333-3333-333333333333', // scanner profile id
        selectedCinemaId
      );

      setLastScanResult(result);
      setScanHistory(prev => [
        { ...result, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 19)
      ]);
      setManualCode('');
    } catch (err: any) {
      setLastScanResult({
        valid: false,
        reason: 'invalid',
        message: err.message || 'Validation error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Camera start / stop simulation
  const toggleCamera = async () => {
    if (isScanningCamera) {
      setIsScanningCamera(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setIsScanningCamera(true);
        } else {
          alert('Camera access is not supported in this browser environment. Use the manual ticket code entry below.');
        }
      } catch (err) {
        console.warn('Camera permission denied or unavailable:', err);
        alert('Camera stream could not be started. You can use the quick manual barcode lookup below.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fa6b38] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#fa6b38]">
              Gate Scanner PWA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Ticket Admission Validator
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Atomic ticket validation with row-level PostgreSQL locks.
          </p>
        </div>

        {/* Cinema selector */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
          <MapPin className="w-4 h-4 text-[#bae861]" />
          <select
            value={selectedCinemaId}
            onChange={(e) => setSelectedCinemaId(e.target.value)}
            className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
          >
            {MOCK_CINEMAS.map(cinema => (
              <option key={cinema.id} value={cinema.id} className="bg-[#14171c] text-white">
                {cinema.name}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Scanner & Camera Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left: Camera & Manual input */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
          
          {/* Camera Viewfinder Box */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/60 border-2 border-dashed border-white/20 flex flex-col items-center justify-center p-4">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover rounded-xl ${isScanningCamera ? 'block' : 'hidden'}`}
            />

            {!isScanningCamera && (
              <div className="text-center space-y-3 p-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-400">
                  <QrCode className="w-8 h-8 text-[#fa6b38]" />
                </div>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                  Position ticket QR code or Code 128 barcode in the center.
                </p>
              </div>
            )}

            {/* Target Reticle */}
            <div className="absolute inset-8 pointer-events-none border-2 border-[#bae861]/40 rounded-2xl flex items-center justify-center">
              <div className="w-full h-0.5 bg-[#bae861] shadow-[0_0_12px_#bae861] animate-pulse" />
            </div>

            <button
              onClick={toggleCamera}
              className="absolute bottom-4 px-4 py-2 rounded-xl glass-panel hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2 shadow-lg"
            >
              <Camera className="w-4 h-4 text-[#bae861]" />
              {isScanningCamera ? 'Turn Camera Off' : 'Activate Camera'}
            </button>
          </div>

          {/* Manual Code Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeScan(manualCode);
            }}
            className="space-y-3"
          >
            <label className="text-xs font-semibold text-gray-300 block">
              Or Type / Paste Barcode Value
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="e.g. MOV-INCEPT-01"
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#fa6b38]"
              />
              <button
                type="submit"
                disabled={!manualCode.trim() || isVerifying}
                className="px-4 py-2.5 rounded-xl bg-[#fa6b38] hover:bg-[#ff7b4b] text-white font-extrabold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all shadow-lg shadow-[#fa6b38]/20"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Admit'}
              </button>
            </div>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">
              Quick Test Passes:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => executeScan('MOV-INCEPT-01')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-300 border border-white/10"
              >
                MOV-INCEPT-01 (Valid)
              </button>
              <button
                type="button"
                onClick={() => executeScan('MOV-DUNE-88')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-300 border border-white/10"
              >
                MOV-DUNE-88 (Used)
              </button>
              <button
                type="button"
                onClick={() => executeScan('INVALID-CODE-999')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-300 border border-white/10"
              >
                Invalid Pass
              </button>
            </div>
          </div>

        </div>


        {/* Right: Instant Scan Verification Card */}
        <div className="space-y-6">
          
          {lastScanResult ? (
            <div
              className={`p-6 sm:p-8 rounded-3xl border animate-in zoom-in-95 duration-200 ${
                lastScanResult.valid
                  ? 'bg-[#bae861]/10 border-[#bae861]/40 text-[#bae861]'
                  : lastScanResult.reason === 'already_used'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {lastScanResult.valid ? (
                  <CheckCircle2 className="w-8 h-8 text-[#bae861] shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 shrink-0" />
                )}
                <div>
                  <h3 className="text-xl font-black text-white">
                    {lastScanResult.valid ? 'ADMISSION GRANTED' : 'ENTRY REJECTED'}
                  </h3>
                  <span className="text-xs uppercase font-extrabold tracking-wider">
                    {lastScanResult.reason.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {lastScanResult.valid ? (
                <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/10 text-white text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Movie:</span>
                    <strong className="font-extrabold">{lastScanResult.movie_title}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Seat:</span>
                    <strong className="font-black text-[#bae861]">{lastScanResult.seat}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Hall:</span>
                    <strong>{lastScanResult.screen_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Customer:</span>
                    <strong>{lastScanResult.customer_name}</strong>
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-gray-300">
                  <p className="font-medium text-white">{lastScanResult.message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-2">
              <Smartphone className="w-8 h-8 text-gray-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">Awaiting Scan</h4>
              <p className="text-xs text-gray-400">
                Aim scanner camera at customer&apos;s ticket pass or input barcode above.
              </p>
            </div>
          )}

          {/* Recent Scans Session Log */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Recent Gate Admissions ({scanHistory.length})
            </h4>

            {scanHistory.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {scanHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.valid ? 'bg-[#bae861]' : 'bg-rose-500'
                        }`}
                      />
                      <span className="font-mono text-white">{item.ticket_code || 'CODE'}</span>
                      {item.seat && <span className="text-gray-400">({item.seat})</span>}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No tickets scanned in this session yet.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
