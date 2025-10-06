import React from 'react'
import { Button } from './ui/button'

const ModeToggle: React.FC = () => {
  return (
    <Button className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
      Toggle Mode
    </Button>
  )
}

export { ModeToggle }
