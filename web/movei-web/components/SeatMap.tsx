'use client';

import React from 'react';
import { Seat, Show } from '../types';

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  show: Show;
}

export default function SeatMap({
  seats,
  selectedSeatIds,
  onToggleSeat,
  show
}: SeatMapProps) {
  // Group seats by row
  const rows = Array.from(new Set(seats.map(s => s.row_label))).sort();

  const getSeatColor = (seat: Seat, isSelected: boolean) => {
    if (seat.status === 'sold') {
      return 'bg-gray-800 border-gray-700 text-transparent cursor-not-allowed opacity-40';
    }
    if (isSelected) {
      return 'bg-[#bae861] border-[#bae861] text-black font-bold shadow-lg shadow-[#bae861]/30 scale-105';
    }
    if (seat.seat_type === 'vip') {
      return 'bg-[#fa6b38]/20 border-[#fa6b38]/60 text-[#fa6b38] hover:bg-[#fa6b38] hover:text-black';
    }
    if (seat.seat_type === 'premium') {
      return 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white';
    }
    return 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/25 hover:text-white';
  };

  const getSeatPrice = (type: Seat['seat_type']) => {
    switch (type) {
      case 'vip': return show.price_vip;
      case 'premium': return show.price_premium;
      default: return show.price_standard;
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-6">
      
      {/* Cinema Screen Curved Projection */}
      <div className="w-full max-w-xl mb-12 text-center">
        <div className="screen-curve h-4 w-full mb-3" />
        <span className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-gray-500">
          CINEMA SCREEN
        </span>
      </div>

      {/* Grid of Seats */}
      <div className="space-y-3 mb-10 w-full max-w-md">
        {rows.map(row => {
          const rowSeats = seats
            .filter(s => s.row_label === row)
            .sort((a, b) => a.seat_number - b.seat_number);

          return (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-4 text-xs font-bold text-gray-500 text-center">{row}</span>

              <div className="flex items-center gap-2">
                {rowSeats.map((seat, index) => {
                  const isSelected = selectedSeatIds.includes(seat.id);
                  const isSold = seat.status === 'sold';
                  const addAisleSpace = index === 3; // Split in middle for aisle

                  return (
                    <React.Fragment key={seat.id}>
                      <button
                        type="button"
                        disabled={isSold}
                        onClick={() => onToggleSeat(seat)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-[11px] flex items-center justify-center transition-all ${getSeatColor(
                          seat,
                          isSelected
                        )}`}
                        title={`Row ${seat.row_label}${seat.seat_number} (${seat.seat_type.toUpperCase()}) - LKR ${getSeatPrice(seat.seat_type)}`}
                      >
                        {seat.seat_number}
                      </button>

                      {addAisleSpace && <div className="w-4 sm:w-6" />}
                    </React.Fragment>
                  );
                })}
              </div>

              <span className="w-4 text-xs font-bold text-gray-500 text-center">{row}</span>
            </div>
          );
        })}
      </div>

      {/* Seat Category Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-400 border-t border-white/10 pt-6 max-w-lg w-full">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-white/10 border border-white/20" />
          <span>Standard (LKR {show.price_standard})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-indigo-950/60 border border-indigo-500/50" />
          <span>Premium (LKR {show.price_premium})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#fa6b38]/20 border border-[#fa6b38]/60" />
          <span>VIP (LKR {show.price_vip})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#bae861] border border-[#bae861]" />
          <span className="text-white font-semibold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-gray-800 border border-gray-700 opacity-40" />
          <span>Sold Out</span>
        </div>
      </div>

    </div>
  );
}
