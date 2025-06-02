"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface ResidentInfoProps {
  onNext: () => void
}

export default function ResidentInfo({ onNext }: ResidentInfoProps) {
  return (
    <div className="bg-white rounded-[2px] shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
      
      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" placeholder="Enter middle name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="suffix">Suffix</Label>
                <Input id="suffix" placeholder="Jr., Sr., III, etc." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="birthDate">Date of Birth</Label>
                <Input id="birthDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select id="gender" className="mt-1">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="civilStatus">Civil Status</Label>
                <Select id="civilStatus" className="mt-1">
                  <option value="">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" placeholder="Enter nationality" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="religion">Religion</Label>
                <Input id="religion" placeholder="Enter religion" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" placeholder="Enter mobile number" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address (optional)</Label>
                <Input id="email" type="email" placeholder="Enter email address" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Person</Label>
                <Input id="emergencyContact" placeholder="Enter full name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emergencyNumber">Emergency Contact Number</Label>
                <Input id="emergencyNumber" placeholder="Enter contact number" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="houseNumber">House/Unit Number</Label>
                <Input id="houseNumber" placeholder="Enter house/unit number" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="street">Street/Subdivision Name</Label>
                <Input id="street" placeholder="Enter street name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="purok">Purok/Zone Number</Label>
                <Input id="purok" placeholder="Enter purok/zone" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="barangay">Barangay</Label>
                <Input id="barangay" placeholder="Enter barangay" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="city">City/Municipality</Label>
                <Input id="city" placeholder="Enter city" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Input id="province" placeholder="Enter province" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" placeholder="Enter ZIP code" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="residencyLength">Length of Residency (years)</Label>
                <Input id="residencyLength" type="number" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Family Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="relationship">Relationship to Household Head</Label>
                <Select id="relationship" className="mt-1">
                  <option value="">Select relationship</option>
                  <option value="head">Head</option>
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="familyMembers">Number of Family Members</Label>
                <Input id="familyMembers" type="number" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="dependents">Names and Ages of Dependents</Label>
                <textarea
                  id="dependents"
                  rows={3}
                  className="mt-1 w-full rounded-[2px] border border-gray-300 px-3 py-2 focus:border-[#23479A] focus:ring-2 focus:ring-[#23479A]/20"
                  placeholder="Enter names and ages (e.g., Juan Dela Cruz - 12, Maria Dela Cruz - 8)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              onNext()
            }}
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px]"
          >
            Next Step
          </Button>
        </div>
      </form>
    </div>
  )
} 