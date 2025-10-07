import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ResidentWelcomeEmailProps {
  email: string
  firstName?: string
}

export default function ResidentWelcomeEmail({ email, firstName }: ResidentWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Alma Villa Portal — Important login instructions inside</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={center}>
            <Img
              src="https://wq8gj23taekk62rr.public.blob.vercel-storage.com/AlmaVilla/Logo.png"
              alt="Alma Villa Logo"
              width="64"
              height="64"
              style={{ borderRadius: 12 }}
            />
          </Section>

          <Section style={card}>
            <Heading style={title}>Welcome{firstName ? `, ${firstName}` : ''}!</Heading>
            <Text style={muted}>Your account was added by the barangay administrator.</Text>

            <Section style={box}>
              <Text style={label}>How to log in</Text>
              <Text style={line}><strong>Username</strong>: {email}</Text>
              <Text style={line}><strong>Default password</strong>: YOUR LAST NAME</Text>
              <Text style={hint}>Example: if your last name is "Delapena", password is "delapena"</Text>
            </Section>

            <Text style={warning}><strong>For your security</strong>: After logging in, immediately go to your profile and change your password.</Text>

            <Section style={center}>
              <Button
                href="https://alma-villa.vercel.app/"
                style={button}
              >
                Open Alma Villa Portal
              </Button>
            </Section>

            <Hr style={hr} />
            <Text style={footer}>Barangay Alma Villa, Gloria, Oriental Mindoro</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f5f7fb',
  fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  padding: '24px',
}

const container = {
  margin: '0 auto',
  maxWidth: '520px',
}

const center = { textAlign: 'center' as const }

const card = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '28px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
}

const title = {
  color: '#23479A',
  fontSize: '22px',
  margin: '0 0 8px 0'
}

const muted = { color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0' }

const box = {
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px'
}

const label = { color: '#111827', fontWeight: 600 as const, margin: '0 0 8px 0' }
const line = { color: '#111827', margin: '0 0 6px 0', fontSize: '14px' }
const hint = { color: '#6b7280', fontSize: '12px', margin: 0 }

const warning = { color: '#b45309', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 8, padding: '12px', fontSize: '13px', margin: '8px 0 16px 0' }

const button = {
  backgroundColor: '#23479A',
  color: '#ffffff',
  fontSize: '14px',
  padding: '12px 16px',
  borderRadius: '8px',
  textDecoration: 'none'
}

const hr = { borderColor: '#e5e7eb', margin: '16px 0' }
const footer = { color: '#6b7280', fontSize: '12px', margin: 0 }


