import Button from '@/atoms/Button'
import Heading from '@/atoms/Heading'
import Image from 'next/image'
import React from 'react'
import { StaticImageData } from "next/image";
import { useRouter } from 'next/router';

interface AddOnCardProps {
  id: number
  src: string | StaticImageData;
  des: string;
  btnText: string;
}


const AddOnCard: React.FC<AddOnCardProps> = ({ src, des, btnText, id}) => {
    const router = useRouter()


  return (
    <div className='grid gap-5 tablet:gap-20 justify-center items-center tablet:grid-cols-2'>
        <Image
        src={src}
        alt="Add-on Service"
        width={400}
        height={300}
        className="w-full h-auto object-cover rounded-2xl shadow-md hover:rounded-2xl transition-transform duration-500"
        />


        <div className='space-y-6 text-center tablet:text-left'>
            <Heading
                Tag="h2" variant="xl" mode="light"
            >{des}</Heading>

            <Button
                variant = "primary"
                width = "full"
                onClick = {() => router.push(`/addOn/${id}`)}
            >
                <span
                    className="w-full text-center"
                    tabIndex={0}
                    role="button"
                >
                    {btnText}
                </span>
            </Button>
        </div>
    </div>
  )
}

export default AddOnCard