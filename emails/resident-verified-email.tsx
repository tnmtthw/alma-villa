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
                Your account is now verified — you can log in to Alma Villa.
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
                        <Heading style={headerText}>Your Account is Verified</Heading>
                    </Section>

                    <Section style={contentContainer}>
                        <Text style={greeting}>Hello {email},</Text>

                        <Text style={paragraph}>
                            Great news! Your account has been verified and is now ready for use.
                        </Text>

                        <Text style={paragraph}>
                            You can now log in to access your dashboard and manage your bookings.
                        </Text>

                        <Section style={buttonContainer}>
                            <a href={loginUrl} style={buttonLink} target="_blank">
                                <div style={loginButton}>
                                    Log in to Alma Villa
                                </div>
                            </a>
                        </Section>

                        <Text style={paragraph}>
                            If the button above doesn’t work, you can also log in here:
                        </Text>

                        <a href={loginUrl} style={mobileLink} target="_blank">
                            {loginUrl}
                        </a>

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

export default AccountVerifiedEmail;

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

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const buttonLink = {
    textDecoration: 'none',
};

const loginButton = {
    backgroundColor: '#6F4E37',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    display: 'block',
    padding: '16px 30px',
    margin: '20px auto',
    maxWidth: '280px',
};

const mobileLink = {
    display: 'block',
    padding: '16px',
    margin: '10px 0 25px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    color: '#6F4E37',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'underline',
    textAlign: 'center' as const,
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
