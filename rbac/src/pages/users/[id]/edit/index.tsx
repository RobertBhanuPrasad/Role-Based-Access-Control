import { CreateUserPage } from '@/pages/create-user';
import React from 'react'

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