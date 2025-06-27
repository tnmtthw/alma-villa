import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
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
                Your account has been created — pending admin approval.
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={headerContainer}>
                        <Img
                            src="https://wq8gj23taekk62rr.public.blob.vercel-storage.com/deku/logo-11qVd4r8k5tOjqMdgoZjW3KYsr3H2v.png"
                            width="120"
                            height="120"
                            alt="Alma Villa Logo"
                            style={logo}
                        />
                        <Heading style={headerText}>Welcome to Alma Villa</Heading>
                    </Section>

                    <Section style={contentContainer}>
                        <Text style={greeting}>Hello {email},</Text>

                        <Text style={paragraph}>
                            Your account has been successfully created. Please wait for an administrator to approve your account.
                        </Text>

                        <Text style={paragraph}>
                            You will receive another email once your account is approved and ready for use.
                        </Text>

                        <Text style={paragraph}>
                            Thank you for joining Alma Villa!
                        </Text>

                        <Text style={signature}>
                            The Alma Villa Team
                        </Text>
                    </Section>

                    <Section style={footerContainer}>
                        <Text style={footerText}>
                            © 2025 Alma Villa. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            123 Coffee Street, Manila, Philippines
                        </Text>
                        <Text style={footerLinks}>
                            <a href="#" style={footerLinkMobile}>Privacy Policy</a> &nbsp;•&nbsp;
                            <a href="#" style={footerLinkMobile}>Terms of Service</a> &nbsp;•&nbsp;
                            <a href="#" style={footerLinkMobile}>Unsubscribe</a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ImprovedVerificationEmail;

// Styles
const main = {
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
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
    backgroundColor: '#6F4E37',
    padding: '30px 20px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto 20px',
    backgroundColor: 'white',
    borderRadius: '60px',
    padding: '10px',
};

const headerText = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center' as const,
};

const contentContainer = {
    backgroundColor: '#ffffff',
    padding: '30px 25px',
    borderRadius: '0 0 4px 4px',
};

const greeting = {
    fontSize: '20px',
    lineHeight: '26px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '20px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4a4a4a',
    marginBottom: '20px',
};

const signature = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555555',
    marginTop: '25px',
};

const footerContainer = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '4px',
    textAlign: 'center' as const,
    marginTop: '20px',
};

const footerText = {
    fontSize: '12px',
    lineHeight: '18px',
    color: '#8898aa',
    margin: '4px 0',
};

const footerLinks = {
    fontSize: '12px',
    lineHeight: '18px',
    color: '#8898aa',
    margin: '16px 0 0',
};

const footerLinkMobile = {
    color: '#6F4E37',
    textDecoration: 'none',
    display: 'inline-block',
    padding: '5px',
};
