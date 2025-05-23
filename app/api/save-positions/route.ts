import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const positions = await request.json()
    const filePath = path.join(process.cwd(), 'public', 'effect-positions.json')
    
    await fs.writeFile(filePath, JSON.stringify(positions, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving positions:', error)
    return NextResponse.json({ error: 'Failed to save positions' }, { status: 500 })
  }
}