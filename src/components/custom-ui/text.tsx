import React from 'react'

interface TextProps {
	label: string
	className?: string
}

const Text: React.FC<TextProps> = ({ label, className }) => {
	return <span className={className}>{label}</span>
}

export default Text
