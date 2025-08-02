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

interface AccountRejectedEmailProps {
    email: string;
}

export const AccountRejectedEmail = ({
    email,
}: AccountRejectedEmailProps) => {

    return (
        <Html>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Preview>
                Your account application has been rejected — Alma Villa Barangay Portal.
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo at top */}
                    <Section style={logoSection}>
                        <table style={logoTable}>
                            <tr>
                                <td style={logoContainer}>
                                    <Img
                                        src="https://wq8gj23taekk62rr.public.blob.vercel-storage.com/AlmaVilla/Logo.png"
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
                        {/* Rejection Icon */}
                        <Section style={iconSection}>
                            <table style={iconTable}>
                                <tr>
                                    <td style={rejectionIcon}>
                                        <span style={xmark}>✕</span>
                                    </td>
                                </tr>
                            </table>
                        </Section>

                        {/* Main Content */}
                        <Heading style={title}>Account Application Rejected</Heading>

                        <Text style={description}>
                            We regret to inform you that your account application has been rejected.
                            Please review your submitted information and contact us if you have any questions.
                        </Text>

                        <Text style={emailText}>
                            Account: {email}
                        </Text>

                        {/* Help Section */}
                        <Text style={helpText}>
                            Need assistance? <a href="mailto:almavilla.gloria@gmail.com" style={supportLink}>Contact support</a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default AccountRejectedEmail;

// Styles matching the design
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

const rejectionIcon = {
    backgroundColor: '#FEE2E2',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
    border: 'none',
    padding: '0',
};

const xmark = {
    color: '#DC2626',
    fontSize: '24px',
    fontWeight: 'bold',
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

const buttonSection = {
    margin: '32px 0',
};

const loginButton = {
    backgroundColor: '#4F72C2',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    display: 'inline-block',
    textAlign: 'center' as const,
    width: '100%',
    boxSizing: 'border-box' as const,
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