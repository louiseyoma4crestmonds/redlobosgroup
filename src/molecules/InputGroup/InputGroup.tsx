import React from 'react'
import { InputGroupProps } from './InputGroup.types'
import Input from '@/atoms/Input/Input'

const InputGroup: React.FC<InputGroupProps> = ({
    icon, placeholder, size, type
}) => {
  return (
    <div className='flex gap-1 px-2 items-center bg-white border border-gray-300 rounded-md overflow-auto'>
            {icon}
            <Input
                placeholder={placeholder}
                size={size}
                className="flex-1"
                type={type}
                getInputedValue={()=>{}}

            />
        </div>
  )
}

export default InputGroup