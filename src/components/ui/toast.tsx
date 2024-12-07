'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  visible: boolean
  message: string
  type: 'info' | 'success' | 'error'
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ visible, message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg`}
        >
          {message}
          <button onClick={onClose} className="ml-2 font-bold">
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}