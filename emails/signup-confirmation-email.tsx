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

interface SignupConfirmationEmailProps {
    email: string;
}

export const ImprovedVerificationEmail = ({
    email,
}: SignupConfirmationEmailProps) => {
    return (
        <Html>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Preview>
                Your registration has been received — pending admin approval.
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo at top */}
                    <Section style={logoSection}>
                        <table style={logoTable}>
                            <tr>
                                <td style={logoContainer}>
                                    <Img
                                        src="https://i.ibb.co/cKwSMjNP/Logo.png"
                                        width="60"
                                        height="60"
                                        alt="Alma Villa Logo"
                                        style={logo}
                                    />
                                </td>
                            </tr>
                        </table>
                    </Section>

                    {/* Main Card */}
                    <Section style={card}>
                        {/* Pending Icon */}
                        <Section style={iconSection}>
                            <table style={iconTable}>
                                <tr>
                                    <td style={pendingIcon}>
                                        <span style={clockIcon}>⏳</span>
                                    </td>
                                </tr>
                            </table>
                        </Section>

                        {/* Main Content */}
                        <Heading style={title}>Registration Received</Heading>
                        
                        <Text style={description}>
                            Your registration has been received and is pending admin approval.
                        </Text>

                        <Text style={emailText}>
                            Account: {email}
                        </Text>

                        {/* Status Info */}
                        <Section style={statusBox}>
                            <Text style={statusTitle}>What happens next?</Text>
                            <Text style={statusItem}>• Document review by barangay administrators</Text>
                            <Text style={statusItem}>• Verification takes 2-3 working days</Text>
                            <Text style={statusItem}>• Email notification once approved</Text>
                            <Text style={statusItem}>• Full access to barangay services</Text>
                        </Section>

                        {/* Services List */}
                        <Section style={servicesBox}>
                            <Text style={servicesTitle}>Once approved, you can:</Text>
                            <Text style={serviceItem}>📄 Request certificates and clearances</Text>
                            <Text style={serviceItem}>📝 Access downloadable forms</Text>
                            <Text style={serviceItem}>📰 View news and announcements</Text>
                            <Text style={serviceItem}>🏢 Apply for business permits</Text>
                        </Section>

                        {/* Help Section */}
                        <Text style={helpText}>
                            Questions about your registration? <a href="mailto:almavilla.gloria@gmail.com" style={supportLink}>Contact support</a>
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Barangay Alma Villa, Gloria, Oriental Mindoro<br/>
                            Office Hours: Mon-Fri 8AM-5PM, Sat 8AM-12PM
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ImprovedVerificationEmail;

// Styles matching the card design
const main = {
    backgroundColor: '#4F72C2',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 20px',
    minHeight: '100vh',
};

const container = {
    margin: '0 auto',
    maxWidth: '480px',
    position: 'relative' as const,
};

const logoSection = {
    textAlign: 'center' as const,
    marginBottom: '20px',
};

const logoTable = {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    borderCollapse: 'collapse' as const,
};

const logoContainer = {
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: 'none',
    padding: '0',
};

const logo = {
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
};

const card = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px 30px',
    textAlign: 'center' as const,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
};

const iconSection = {
    marginBottom: '24px',
};

const iconTable = {
    width: '64px',
    height: '64px',
    margin: '0 auto',
    borderCollapse: 'collapse' as const,
};

const pendingIcon = {
    backgroundColor: '#FEF3C7',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
    border: 'none',
    padding: '0',
};

const clockIcon = {
    fontSize: '24px',
    lineHeight: '64px',
    textAlign: 'center' as const,
    fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
    display: 'inline-block',
    verticalAlign: 'middle',
};

const title = {
    color: '#4F72C2',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    textAlign: 'center' as const,
};

const description = {
    color: '#6B7280',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 20px 0',
    textAlign: 'center' as const,
};

const emailText = {
    color: '#4F72C2',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 32px 0',
    textAlign: 'center' as const,
};

const statusBox = {
    backgroundColor: '#F0F9FF',
    border: '1px solid #0EA5E9',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    textAlign: 'left' as const,
};

const statusTitle = {
    color: '#0C4A6E',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px 0',
};

const statusItem = {
    color: '#0369A1',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px 0',
};

const servicesBox = {
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    textAlign: 'left' as const,
};

const servicesTitle = {
    color: '#374151',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px 0',
};

const serviceItem = {
    color: '#4B5563',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px 0',
};

const helpText = {
    color: '#6B7280',
    fontSize: '14px',
    margin: '24px 0 0 0',
    textAlign: 'center' as const,
};

const supportLink = {
    color: '#4F72C2',
    textDecoration: 'none',
    fontWeight: '600',
};

const footer = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '24px',
    textAlign: 'center' as const,
};

const footerText = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
};