import React from 'react'
import { CreateUserPage } from '../../add';

const index = () => {
  return (
    <div><EditUserPage/></div>
  )
}

export default index;

export const EditUserPage = () => {
    return (
        <CreateUserPage/>
    )
}