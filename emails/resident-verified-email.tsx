import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface AccountVerifiedEmailProps {
    email: string;
}

export const AccountVerifiedEmail = ({
    email,
}: AccountVerifiedEmailProps) => {

    const loginUrl = "https://alma-villa.vercel.app/account/login"

    return (
        <Html>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Preview>
                Your account is now verified — you can log in to Alma Villa Barangay Portal.
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={headerContainer}>
                        <Img
                            src="/assets/img/Logo.png"
                            width="80"
                            height="80"
                            alt="Alma Villa Logo"
                            style={logo}
                        />
                        <Heading style={headerText}>Alma Villa</Heading>
                        <Text style={subHeaderText}>Barangay Portal</Text>
                        <Heading style={titleText}>Your Account is Verified</Heading>
                    </Section>

                    <Section style={contentContainer}>
                        <Text style={greeting}>Hello {email},</Text>

                        <Text style={paragraph}>
                            Great news! Your account has been verified and is now ready for use.
                        </Text>

                        <Text style={paragraph}>
                            You can now log in to access your dashboard and manage your barangay services and document requests.
                        </Text>

                        <Section style={buttonContainer}>
                            <a href={loginUrl} style={buttonLink} target="_blank">
                                <div style={loginButton}>
                                    Log in to Alma Villa Portal
                                </div>
                            </a>
                        </Section>

                        <Text style={paragraph}>
                            If the button above doesn't work, you can also log in here:
                        </Text>

                        <a href={loginUrl} style={mobileLink} target="_blank">
                            {loginUrl}
                        </a>

                        <Text style={signature}>
                            The Alma Villa Barangay Team
                        </Text>
                    </Section>

                    <Section style={footerContainer}>
                        <Text style={footerText}>
                            © 2025 Barangay Alma Villa, Gloria, Oriental Mindoro. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            Barangay Alma Villa, Gloria, Oriental Mindoro
                        </Text>
                        <Text style={footerText}>
                            Email: almavilla.gloria@gmail.com
                        </Text>
                        <Text style={footerText}>
                            Office Hours: Monday - Friday: 8:00 AM - 5:00 PM | Saturday: 8:00 AM - 12:00 PM
                        </Text>
                        <Text style={footerLinks}>
                            <a href="#" style={footerLinkMobile}>Privacy Policy</a> &nbsp;•&nbsp;
                            <a href="#" style={footerLinkMobile}>Terms of Service</a> &nbsp;•&nbsp;
                            <a href="#" style={footerLinkMobile}>Contact Us</a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default AccountVerifiedEmail;

// Styles
const main = {
    backgroundColor: '#f8fafc',
    fontFamily: 'Inter, Arial, sans-serif',
    color: '#1f2937',
    margin: '0',
    padding: '0',
};

const container = {
    margin: '0 auto',
    padding: '0',
    width: '100%',
    maxWidth: '600px',
};

const headerContainer = {
    backgroundColor: '#23479A',
    padding: '40px 20px',
    textAlign: 'center' as const,
    backgroundImage: 'linear-gradient(135deg, #23479A 0%, #1e3a7a 100%)',
};

const logo = {
    margin: '0 auto 16px',
    backgroundColor: 'white',
    borderRadius: '50%',
    padding: '12px',
    border: '3px solid rgba(255, 255, 255, 0.2)',
};

const headerText = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    letterSpacing: '-0.5px',
};

const subHeaderText = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0 0 24px 0',
    letterSpacing: '0.5px',
};

const titleText = {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '600',
    margin: '0',
    padding: '16px 0 0 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
};

const contentContainer = {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const greeting = {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '24px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#4b5563',
    marginBottom: '20px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const buttonLink = {
    textDecoration: 'none',
};

const loginButton = {
    backgroundColor: '#23479A',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center' as const,
    display: 'block',
    padding: '16px 32px',
    margin: '20px auto',
    maxWidth: '300px',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgba(35, 71, 154, 0.1)',
    transition: 'all 0.2s ease',
};

const mobileLink = {
    display: 'block',
    padding: '16px',
    margin: '10px 0 32px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#23479A',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'underline',
    textAlign: 'center' as const,
    wordBreak: 'break-all' as const,
};

const signature = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
};

const footerContainer = {
    backgroundColor: '#f9fafb',
    padding: '24px 20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    marginTop: '24px',
    border: '1px solid #e5e7eb',
};

const footerText = {
    fontSize: '12px',
    lineHeight: '18px',
    color: '#6b7280',
    margin: '4px 0',
};

const footerLinks = {
    fontSize: '12px',
    lineHeight: '18px',
    color: '#6b7280',
    margin: '16px 0 0',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
};

const footerLinkMobile = {
    color: '#23479A',
    textDecoration: 'none',
    display: 'inline-block',
    padding: '4px 8px',
    fontWeight: '500',
};