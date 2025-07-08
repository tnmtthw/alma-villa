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
                    {/* Logo at top */}
                    <Section style={logoSection}>
                        <div style={logoContainer}>
                            <Img
                                src="https://i.ibb.co/cKwSMjNP/Logo.png"
                                width="60"
                                height="60"
                                alt="Alma Villa Logo"
                                style={logo}
                            />
                        </div>
                    </Section>

                    {/* Main Card */}
                    <Section style={card}>
                        {/* Success Icon */}
                        <Section style={iconSection}>
                            <div style={successIcon}>
                                <div style={checkmark}>✓</div>
                            </div>
                        </Section>

                        {/* Main Content */}
                        <Heading style={title}>Account Verified!</Heading>
                        
                        <Text style={description}>
                            Your account has been successfully verified and is ready to use.
                        </Text>

                        <Text style={emailText}>
                            Account: {email}
                        </Text>

                        {/* Login Button */}
                        <Section style={buttonSection}>
                            <a href={loginUrl} style={loginButton}>
                                Log in to Your Account
                            </a>
                        </Section>

                        {/* Help Section */}
                        <Text style={helpText}>
                            Still having trouble? <a href="mailto:almavilla.gloria@gmail.com" style={supportLink}>Contact support</a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default AccountVerifiedEmail;

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

const logoContainer = {
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    margin: '0 auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
};

const logo = {
    borderRadius: '50%',
    display: 'block',
    margin: '0 auto',
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

const successIcon = {
    backgroundColor: '#E8F5E8',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    margin: '0 auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
};

const checkmark = {
    color: '#22C55E',
    fontSize: '28px',
    fontWeight: 'bold',
    lineHeight: '1',
    textAlign: 'center' as const,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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