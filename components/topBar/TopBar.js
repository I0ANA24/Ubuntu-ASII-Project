"use client";

import React, { useState, useEffect } from 'react'

const TopBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const month = currentTime.toLocaleString('en-US', { month: 'short' })
  const day = currentTime.getDate()
  const hour = currentTime.getHours().toString().padStart(2, '0')
  const minute = currentTime.getMinutes().toString().padStart(2, '0')

  const formattedTime = `${month} ${day}        ${hour}:${minute}`

  return (
    <header className="w-full h-7 bg-black/70 text-white text-sm flex items-center justify-center absolute top-0 left-0 whitespace-pre">
      {formattedTime}
    </header>
  )
}

export default TopBar
