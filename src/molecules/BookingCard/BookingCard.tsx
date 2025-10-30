import Heading from '@/atoms/Heading'
import React, { useState } from 'react'
import InputGroup from '../InputGroup/InputGroup'
import UserIcon from '@/atoms/Icons/User'
import MessageIcon from '@/atoms/Icons/Message'
import DateIcon from '@/atoms/Icons/Calendar'
import Button from '@/atoms/Button'
import Input from '@/atoms/Input/Input'

const BookingCard = () => {
    const [account, setAccount] = useState<any>()

    const handleSubmit = () => {
        console.log(account)
    }
  return (
    <div className='flex flex-col justify-center p-10 tablet:p-20 phone:w-full max-w-[600px] border-2 rounded-lg shadow-2xl space-y-6 tablet:mx-auto my-4'>
        <Heading
            Tag='h2'
            className='text-center'
        >
            START YOUR BOOKING
        </Heading>
        {account}

        <div className='space-y-3'>
            <Input 
                placeholder='hi'
                className="flex-1"
                icon={<UserIcon />}
                getInputedValue={setAccount}
            />
                
            <InputGroup 
            icon={<UserIcon />}
            placeholder='Name'
            size='medium'
            />
            <InputGroup 
            icon={<MessageIcon />}
            placeholder='Email'
            size='medium' 
            type='email'
            />
            <InputGroup 
            icon={<DateIcon />}
            placeholder='Preferred Date'
            size='medium'
            type='date'
            />
        </div>

        <Button onClick={handleSubmit}>
            <span className='w-full text-center'>CONFIRM BOOKING</span>
        </Button>
    </div>
  )
}

export default BookingCard