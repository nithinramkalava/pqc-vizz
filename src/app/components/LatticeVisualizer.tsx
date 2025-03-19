'use client';

import React, { useState } from 'react';

interface LatticeVisualizerProps {
  data: Uint8Array | null;
  label: string;
  maxRows?: number;
  maxCols?: number;
}

export default function LatticeVisualizer({ 
  data, 
  label, 
  maxRows = 16, 
  maxCols = 16
}: LatticeVisualizerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!data) return null;
  
  // Convert bytes to a 2D matrix
  const matrixSize = Math.min(data.length, maxRows * maxCols);
  const rows = Math.min(maxRows, Math.ceil(Math.sqrt(matrixSize)));
  const cols = Math.min(maxCols, Math.ceil(matrixSize / rows));
  
  const matrix: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j;
      if (index < data.length) {
        row.push(data[index]);
      } else {
        row.push(0);
      }
    }
    matrix.push(row);
  }
  
  // Determine how many cells to show in collapsed view
  const collapsedRows = Math.min(rows, 8);
  const collapsedCols = Math.min(cols, 8);
  
  // Pick a colormap - brighter colors for higher values
  const getColor = (value: number) => {
    const hue = (value / 255) * 240; // 0-240 degrees in hue (blue to red)
    const saturation = 80;
    const lightness = 40 + (value / 255) * 40; // 40-80% lightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-700">{label} Lattice Representation</span>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      
      <div className="bg-secondary-50 p-2 rounded-lg overflow-hidden">
        <div className="grid" style={{ 
          gridTemplateColumns: `repeat(${isExpanded ? cols : collapsedCols}, minmax(0, 1fr))`,
          gap: '1px' 
        }}>
          {matrix.slice(0, isExpanded ? rows : collapsedRows).map((row, i) => 
            row.slice(0, isExpanded ? cols : collapsedCols).map((value, j) => (
              <div 
                key={`${i}-${j}`} 
                className="w-full aspect-square flex items-center justify-center"
                style={{ 
                  backgroundColor: getColor(value),
                  fontSize: '10px',
                  color: value > 128 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
                }}
                title={`Value: ${value}`}
              >
                {isExpanded ? value : ''}
              </div>
            ))
          )}
        </div>
        
        {!isExpanded && (data.length > collapsedRows * collapsedCols) && (
          <div className="text-xs text-center text-secondary-600 mt-2">
            Showing {collapsedRows}x{collapsedCols} of {rows}x{cols} matrix ({data.length} bytes)
          </div>
        )}
      </div>
    </div>
  );
} 