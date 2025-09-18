import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || ''

  // Handle multipart form-data for mass import
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Load workbook from uploaded buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.worksheets[0]
    if (!worksheet) {
      return NextResponse.json({ error: 'No worksheet found' }, { status: 400 })
    }

    // Read header row
    const headerRow = worksheet.getRow(1)
    const headers: string[] = []
    headerRow.eachCell((cell) => headers.push(String(cell.value ?? '').trim()))

    const rowsToCreate: any[] = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      const record: Record<string, any> = {}
      row.eachCell((cell, colNumber) => {
        const key = headers[colNumber - 1]
        record[key] = cell.value ?? ''
      })

      const lastName = record['Last Name'] || record['lastName'] || record['LastName']
      const firstName = record['First Name'] || record['firstName'] || record['FirstName']
      if (!firstName || !lastName) return

      const toCreate = {
        firstName,
        lastName,
        middleName: record['Middle Name'] || record['middleName'] || record['MiddleName'] || '',
        suffix: record['Suffix'] || '',
        birthDate: record['Date of Birth'] ? new Date(record['Date of Birth']).toISOString() : null,
        age: String(Number(record['Age'] ?? 0) || 0),
        placeOfBirth: record['Place of Birth'] || '',
        gender: String(record['Gender'] || '').toLowerCase(),
        civilStatus: record['Civil Status'] || '',
        nationality: record['Nationality'] || '',
        religion: record['Religion'] || '',
        email: record['Email Address'] || record['Email'] || '',
        mobileNumber: record['Mobile Number'] || record['Contact Number'] || '',
        emergencyContact: record['Emergency Contact Name'] || record['Emergency Contact'] || '',
        emergencyNumber: record['Emergency Contact Number'] || record['Emergency Number'] || '',
        purok: record['Sitio'] || '',
        barangay: record['Barangay'] || '',
        city: record['Municipality'] || record['City'] || '',
        province: record['Province'] || '',
        zipCode: String(record['ZIP Code'] || record['Zip'] || ''),
        residencyLength: String(Number(record['Residency (years)'] ?? record['Residency'] ?? 0) || 0),
        type: 'Mass Import',
        frontId: '',
        backId: '',
        capturedPhoto: '',
      }
      rowsToCreate.push(toCreate)
    })

    const createdIds: string[] = []
    for (const data of rowsToCreate) {
      const hashedPassword = await hash(data.lastName, 12)
      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })
      createdIds.push(String((user as any).id ?? ''))
    }

    return NextResponse.json({ success: true, count: createdIds.length })
  }

  // Manual JSON add (existing behavior)
  const { lastName, ...rest } = await req.json()
  const hashedPassword = await hash(lastName, 12)

  const user = await prisma.user.create({
    data: {
      lastName: lastName,
      password: hashedPassword,
      ...rest
    },
  })

  return NextResponse.json({ success: true, user })
}
