'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { UnicornStudio } from '@/components/unicorn-studio'

interface Position {
  x: number
  y: number
  scale: number
}

interface ViewportPosition extends Position {
  viewport: {
    width: number
    height: number
  }
}

interface SavedPositions {
  [key: string]: ViewportPosition // Key will be "width_height" e.g., "1920_1080"
}

interface InteractiveEffectPositionerProps {
  jsonPath: string
  onPositionsSaved?: (positions: SavedPositions) => void
  initialPositions?: SavedPositions
}

export function InteractiveEffectPositioner({ 
  jsonPath, 
  onPositionsSaved,
  initialPositions = {}
}: InteractiveEffectPositionerProps) {
  // Load positions from JSON file on mount
  useEffect(() => {
    fetch('/effect-positions.json')
      .then(res => res.json())
      .then(data => {
        if (data && (data.desktop || data.tablet || data.mobile)) {
          setSavedPositions(data)
        }
      })
      .catch(err => console.log('No saved positions found'))
  }, [])
  const [isPositioningMode, setIsPositioningMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(100)
  const [savedPositions, setSavedPositions] = useState<SavedPositions>(initialPositions)
  const [showGrid, setShowGrid] = useState(false)
  
  const effectRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 })

  // Load initial position based on viewport
  useEffect(() => {
    const loadPositionForViewport = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const viewportKey = `${width}_${height}`
      
      // Try to find exact match first
      if (savedPositions[viewportKey]) {
        const savedPos = savedPositions[viewportKey]
        setPosition({ x: savedPos.x, y: savedPos.y })
        setScale(savedPos.scale)
        return
      }
      
      // Find closest viewport size
      let closestKey: string | null = null
      let closestDistance = Infinity
      
      Object.keys(savedPositions).forEach(key => {
        const [savedWidth, savedHeight] = key.split('_').map(Number)
        const distance = Math.abs(width - savedWidth) + Math.abs(height - savedHeight)
        if (distance < closestDistance) {
          closestDistance = distance
          closestKey = key
        }
      })
      
      if (closestKey && savedPositions[closestKey]) {
        const savedPos = savedPositions[closestKey]
        setPosition({ x: savedPos.x, y: savedPos.y })
        setScale(savedPos.scale)
      }
    }
    
    loadPositionForViewport()
    window.addEventListener('resize', loadPositionForViewport)
    return () => window.removeEventListener('resize', loadPositionForViewport)
  }, [savedPositions])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPositioningMode) return
    
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: position.x,
      elementY: position.y
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y
    
    setPosition({
      x: dragStartRef.current.elementX + deltaX,
      y: dragStartRef.current.elementY + deltaY
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  const saveCurrentPosition = async () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const viewportKey = `${width}_${height}`
    
    const currentPos: ViewportPosition = {
      x: position.x,
      y: position.y,
      scale: scale,
      viewport: {
        width: width,
        height: height
      }
    }
    
    try {
      // First, fetch the current positions from the JSON file
      const currentData = await fetch('/effect-positions.json').then(res => res.json())
      
      // Merge with new position using viewport key
      const newPositions = {
        ...currentData,
        [viewportKey]: currentPos
      }
      
      setSavedPositions(newPositions)
      if (onPositionsSaved) {
        onPositionsSaved(newPositions)
      }
      
      // Save to JSON file
      const response = await fetch('/api/save-positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPositions)
      })
      if (response.ok) {
        console.log(`Saved position for viewport ${width}×${height}:`, currentPos)
      }
      
      // Also copy to clipboard as backup
      navigator.clipboard.writeText(JSON.stringify(newPositions, null, 2))
    } catch (error) {
      console.error('Failed to save positions:', error)
    }
  }

  const getCurrentViewportInfo = () => {
    return `${window.innerWidth}×${window.innerHeight}`
  }
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const controlPanel = (
    <div className="fixed top-4 left-4 bg-background/95 backdrop-blur border rounded-lg p-4 shadow-lg" style={{ zIndex: 99999 }}>
      <button
          type="button"
          onClick={() => setIsPositioningMode(!isPositioningMode)}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            isPositioningMode 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {isPositioningMode ? 'Exit' : 'Enter'} Positioning Mode
        </button>
        
        {isPositioningMode && (
          <div className="mt-4 space-y-4">
            {/* Position Info */}
            <div className="text-sm space-y-1">
              <div>Position: X: {position.x}px, Y: {position.y}px</div>
              <div>Scale: {scale}%</div>
              <div>Viewport: <span className="font-bold">{getCurrentViewportInfo()}</span></div>
            </div>
            
            {/* Scale Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Scale:</label>
              <input
                type="range"
                min="50"
                max="200"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScale(75)}
                  className="px-2 py-1 text-xs bg-secondary rounded hover:bg-secondary/80"
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => setScale(100)}
                  className="px-2 py-1 text-xs bg-secondary rounded hover:bg-secondary/80"
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => setScale(150)}
                  className="px-2 py-1 text-xs bg-secondary rounded hover:bg-secondary/80"
                >
                  150%
                </button>
              </div>
            </div>
            
            {/* Grid Toggle */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded"
              />
              Show Grid
            </label>
            
            {/* Save Button */}
            <button
              type="button"
              onClick={saveCurrentPosition}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
            >
              Save Position for {getCurrentViewportInfo()}
            </button>
            
            {/* Saved Positions */}
            <div className="text-xs space-y-1 pt-2 border-t">
              <div className="font-medium">Saved Positions:</div>
              {Object.entries(savedPositions).map(([key, pos]) => {
                const [w, h] = key.split('_')
                return (
                  <div key={key} className="text-muted-foreground">
                    {w}×{h}: X:{pos.x}, Y:{pos.y}, Scale:{pos.scale}%
                  </div>
                )
              })}
            </div>
          </div>
        )}
    </div>
  )

  return (
    <>
      {/* Render control panel in portal */}
      {mounted && createPortal(controlPanel, document.body)}
      
      {/* Grid Overlay */}
      {showGrid && isPositioningMode && (
        <div className="fixed inset-0 pointer-events-none z-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Center lines */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      )}

      {/* Effect Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0"
        style={{ 
          pointerEvents: isPositioningMode ? 'auto' : 'none',
          mixBlendMode: 'screen',
          zIndex: isPositioningMode ? 40 : 0
        }}
      >
        <div
          ref={effectRef}
          className={`absolute ${isPositioningMode ? 'cursor-move' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale / 100})`,
            transformOrigin: 'top left',
            width: '100%',
            height: '100%',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            pointerEvents: 'none'
          }}
        >
          {/* Visual indicator when in positioning mode */}
          {isPositioningMode && (
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full" />
            </div>
          )}
          
          <UnicornStudio 
            jsonFilePath={jsonPath}
            width="100%"
            height="100%"
          />
        </div>
        
        {/* Draggable overlay */}
        {isPositioningMode && (
          <div
            className="absolute cursor-move"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale / 100})`,
              transformOrigin: 'top left',
              width: '100%',
              height: '100%',
              zIndex: 30,
              pointerEvents: 'auto',
              backgroundColor: 'rgba(59, 130, 246, 0.1)', // Subtle blue overlay
              border: '2px dashed rgba(59, 130, 246, 0.5)'
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50 text-sm font-medium pointer-events-none">
              Drag to move
            </div>
          </div>
        )}
      </div>
    </>
  )
}