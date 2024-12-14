import React from 'react'

const LegalStatures = ({index, stature}) => {
  return (
    <div className='flex items-center bg-PrimaryGrayLight p-4 rounded-lg'>
      <div className='bg-PrimaryGrayLighter px-3.5 py-1 rounded-md'>
        <p>{index}</p>
      </div>
      <p className='ml-3'>{stature}</p>
    </div>
  )
}

export default LegalStatures
