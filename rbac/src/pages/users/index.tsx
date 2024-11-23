import Form from '@/components/FormField'
import React, { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import CloseEyeIcon from '../../../public/asserts/closeEyeIcon'
import OpenEyeIcon from '../../../public/asserts/openEyeIcon'

const index = () => {
    const onSubmit = (data: unknown) => {
        console.log("formbhanudata", data);
      };
  return (
    <div className="">
      <div>
        <Form
          onSubmit={onSubmit}
        >
            <UserPage/>
        </Form>
      </div>
    </div>
  )
}

export default index

export const UserPage = () => {
    const [loading, setLoading] = useState(false);
    const { getValues } = useFormContext();
    const formData = getValues();
    const [passwordShow, setPasswordShow] = useState(false);
  
  
    // use controller for first name
    const {
      field: { value: firstName, onChange: onfirstname },
    } = useController({
      name: "firstName",
    });
  
    // use controller for last name
    const {
      field: { value: lastName, onChange: onlastName },
    } = useController({
      name: "lastName",
    });
  
    // use controller for email
    const {
      field: { value: email, onChange: onEmail },
    } = useController({
      name: "email",
    });

  
    // use controller for password
    const {
      field: { value: password, onChange: onPassword },
    } = useController({
      name: "password",
    });
  
  
    interface FormData {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }

    const onSubmitForm = (formData: FormData) => {
      setLoading(true);
  
      console.log(formData, "form data");
    }

    
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
          <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>
          <div className="flex flex-col gap-y-6">
            {/* First Name */}
            <div className="form-control flex flex-col">
              <label htmlFor="firstName" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] font-semibold">First Name</span>
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter first name"
                className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
                value={firstName}
                onChange={onfirstname}
              />
            </div>
      
            {/* Last Name */}
            <div className="form-control flex flex-col">
              <label htmlFor="lastName" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] font-semibold">Last Name</span>
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter last name"
                className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
                value={lastName}
                onChange={onlastName}
              />
            </div>
      
            {/* Email */}
            <div className="form-control flex flex-col">
              <label htmlFor="email" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] font-semibold">Email</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
                value={email}
                onChange={onEmail}
              />
            </div>
      
            {/* Password */}
            <div className="form-control flex flex-col">
              <label htmlFor="password" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] font-semibold">Password</span>
              </label>
              <div className="flex h-[40px] w-full items-center justify-between rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus-within:border-blue-700">
                <input
                  type={passwordShow ? "text" : "password"}
                  value={password}
                  className="focus:outline-none flex-1"
                  onChange={(e) => {
                    e.stopPropagation();
                    onPassword(e.target.value);
                  }}
                  placeholder="Enter password"
                />
                <span
                  tabIndex={3}
                  className="mr-[10px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPasswordShow(!passwordShow);
                  }}
                  onKeyDown={(e) => {
                    if (e.code === "Enter" || e.code === "Space") {
                      setPasswordShow(!passwordShow);
                    }
                  }}
                >
                  {passwordShow ? <CloseEyeIcon /> : <OpenEyeIcon />}
                </span>
              </div>
            </div>
      
            {/* Role (Optional Placeholder) */}
            <div className="form-control flex flex-col">
              <label className="text-[18px] sm:text-[20px] font-semibold mb-2">Role:</label>
              <div className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none flex items-center justify-center">
                {/* Placeholder for Role Input */}
                Role Selection Component Placeholder
              </div>
            </div>
      
            {/* Submit Button */}
            <div className="form-control flex justify-center mt-6">
              {loading ? (
                <div className="flex h-[40px] w-[200px] items-center justify-center rounded-[12px] border border-solid border-slate-600 bg-[#fff]">
                  <div className="loader"></div>
                </div>
              ) : (
                <button
                  className="h-[40px] w-full sm:w-[200px] cursor-pointer rounded-[12px] bg-[#7677F4] font-semibold text-white hover:bg-[#5c5cf0]"
                  onClick={() => {
                    onSubmitForm(formData as FormData);
                  }}
                  type="button"
                  disabled={loading}
                >
                  Sign-Up
                </button>
              )}
            </div>
          </div>
        </div>
      </main>      
    )
}