import React, { useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Import Quill's CSS
import { Label } from '../ui/label'
import { X } from 'lucide-react'

interface FormTextareaProps {
	id: string
	label: string
	placeholder: string
	value: string
	onChange: (content: string) => void // onChange now takes a string
	required?: boolean
	onClear?: () => void
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
	id,
	label,
	placeholder,
	value,
	onChange,
	required = false,
	onClear
}) => {
	const modules = {
		toolbar: [
			[{ header: '1' }, { header: '2' }, { font: [] }],
			[{ size: [] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
			['clean']
		]
	}

	const formats = [
		'header',
		'font',
		'size',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'video'
	]

	return (
		<div>
			<Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			<div className="relative">
				<ReactQuill
					ref={useRef(null)}
					theme="snow"
					value={value}
					onChange={onChange}
					modules={modules}
					formats={formats}
					placeholder={placeholder}
					className="w-full min-h-[100px]"
				/>
				{onClear && value && (
					<X className="absolute right-3 top-4 h-5 w-5 text-gray-400 cursor-pointer" onClick={onClear} />
				)}
			</div>
		</div>
	)
}
