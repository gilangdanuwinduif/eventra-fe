import React from 'react'

import { TextProps } from '../../interfaces/TextProps'

const Text: React.FC<TextProps> = ({ label, className }) => {
	return <span className={className}>{label}</span>
}

export default Text
