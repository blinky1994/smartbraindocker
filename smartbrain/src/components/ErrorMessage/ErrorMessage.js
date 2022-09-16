import React from 'react'

const ErrorMessage = (props) => {
  return (
    <div className='mt-4 f5 flex center'>
        <div className='ba b--red-10 br2 w-100 mw6 red'>
            {props.errorMessage}
        </div>
        
    </div>
  )
}

export default ErrorMessage