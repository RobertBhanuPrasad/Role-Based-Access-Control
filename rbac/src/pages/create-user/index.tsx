import Form from '@/components/FormField'
import React, { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import CloseEyeIcon from '../../../public/asserts/closeEyeIcon'
import OpenEyeIcon from '../../../public/asserts/openEyeIcon'
import { Button } from '@/ui/button'

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
            <CreateUserPage/>
        </Form>
      </div>
    </div>
  )
}

export default index

export const CreateUserPage = () => {
    const [loading, setLoading] = useState(false);
    const { getValues } = useFormContext();
    const formData = getValues();
    const [passwordShow, setPasswordShow] = useState(false);
    
    // use controller for first name
    const {
      field: { value: firstName, onChange: onFirstName },
    } = useController({
      name: "firstName",
    });
    
    // use controller for last name
    const {
      field: { value: lastName, onChange: onLastName },
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
    
    // use controller for role
    const {
      field: { value: role, onChange: onRole },
    } = useController({
      name: "role",
    });
    
    // use controller for phone number
    const {
      field: { value: phoneNumber, onChange: onPhoneNumber },
    } = useController({
      name: "phoneNumber",
    });
    
    // use controller for status
    const {
      field: { value: status, onChange: onStatus },
    } = useController({
      name: "status",
    });
    
    // use controller for date of birth
    const {
      field: { value: dateOfBirth, onChange: onDateOfBirth },
    } = useController({
      name: "dateOfBirth",
    });
    
    // use controller for address
    const {
      field: { value: address, onChange: onAddress },
    } = useController({
      name: "address",
    });
    
    interface FormData {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: string;
      phoneNumber: string;
      status: string;
      dateOfBirth: string;
      address: string;
    }
    
    const onSubmitForm = (formData: FormData) => {
      setLoading(true);
  
      console.log(formData, "form data");
    }

    
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
          <h1 className="text-2xl font-semibold text-center mb-6">Create User</h1>
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
                onChange={onFirstName}
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
                onChange={onLastName}
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
      
            {/* Role */}
            <div className="form-control flex flex-col">
              <label htmlFor="role" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] font-semibold">Role</span>
              </label>
              <select
                id="role"
                className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
                value={role}
                onChange={onRole}
              >
                <option value="" disabled>Select Role</option>
                {/* {roles.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption}
                  </option>
                ))} */}
              </select>
            </div>
      
            {/* Phone Number */}
            <div className="form-control flex flex-col">
              <label htmlFor="phoneNumber" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] font-semibold">Phone Number</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="Enter phone number"
                className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
                value={phoneNumber}
                onChange={onPhoneNumber}
              />
            </div>
      
            {/* Status */}
            <div className="form-control flex flex-col">
              <label htmlFor="status" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] font-semibold">Status</span>
              </label>
              <select
                id="status"
                className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
                value={status}
                onChange={onStatus}
              >
                {/* {statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))} */}
              </select>
            </div>

            {/* Date of Birth */}
      <div className="form-control flex flex-col">
        <label htmlFor="dateOfBirth" className="label mb-2">
          <span className="label-text text-[18px] sm:text-[20px] font-semibold">Date of Birth</span>
        </label>
        <input
          type="date"
          id="dateOfBirth"
          placeholder="Enter date of birth"
          className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
          value={dateOfBirth}
          onChange={onDateOfBirth}
          required
        />
      </div>

      {/* Address */}
      <div className="form-control flex flex-col">
        <label htmlFor="address" className="label mb-2">
          <span className="label-text text-[18px] sm:text-[20px] font-semibold">Address</span>
        </label>
        <textarea
          id="address"
          placeholder="Enter address"
          className="h-[80px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
          value={address}
          onChange={onAddress}
          required
        />
      </div>

      
            {/* Submit Button */}
            <div className="form-control flex justify-center mt-6">
            <Button
                      type="button"
                      className="h-[46px] min-w-[106px] rounded-[12px] bg-[#7677F4] text-base font-bold"
                      onClick={() => onSubmitForm(formData as FormData)}
                    >
                        {loading && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[white]/50 opacity-100">
                          <div className="loader"></div>
                        </div>
                      )}
                      Create User
                      </Button>
            </div>
          </div>
        </div>
      </main>        
    )
}