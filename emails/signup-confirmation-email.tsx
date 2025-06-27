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
                Your registration has been received — pending admin approval.
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
                        <Heading style={titleText}>Registration Received</Heading>
                    </Section>

                    <Section style={statusContainer}>
                        <div style={statusCard}>
                            <div style={statusIcon}>⏳</div>
                            <Text style={statusText}>Pending Admin Approval</Text>
                        </div>
                    </Section>

                    <Section style={contentContainer}>
                        <Text style={greeting}>Hello {email},</Text>

                        <Text style={paragraph}>
                            Thank you for registering with the Barangay Alma Villa Portal. Your registration has been successfully received and is currently under review.
                        </Text>

                        <Section style={infoBox}>
                            <Text style={infoTitle}>What happens next?</Text>
                            <Text style={infoParagraph}>
                                • Our barangay administrators will review your submitted documents
                            </Text>
                            <Text style={infoParagraph}>
                                • Verification typically takes 2-3 working days
                            </Text>
                            <Text style={infoParagraph}>
                                • You'll receive an email notification once approved
                            </Text>
                            <Text style={infoParagraph}>
                                • After approval, you can access all barangay services
                            </Text>
                        </Section>

                        <Text style={paragraph}>
                            Once your account is approved, you'll be able to:
                        </Text>

                        <Section style={servicesList}>
                            <Text style={serviceItem}>📄 Request barangay certificates and clearances</Text>
                            <Text style={serviceItem}>📝 Access downloadable forms</Text>
                            <Text style={serviceItem}>📰 Stay updated with barangay news and announcements</Text>
                            <Text style={serviceItem}>🏢 Apply for business permits</Text>
                        </Section>

                        <Text style={paragraph}>
                            If you have any questions about your registration, please contact our office during business hours.
                        </Text>

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

export default ImprovedVerificationEmail;

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

const statusContainer = {
    backgroundColor: '#ffffff',
    padding: '20px',
    textAlign: 'center' as const,
};

const statusCard = {
    backgroundColor: '#fef3c7',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '20px',
    display: 'inline-block',
    textAlign: 'center' as const,
    minWidth: '250px',
};

const statusIcon = {
    fontSize: '32px',
    marginBottom: '8px',
};

const statusText = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#92400e',
    margin: '0',
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

const infoBox = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #0284c7',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
};

const infoTitle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: '16px',
};

const infoParagraph = {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#0369a1',
    marginBottom: '8px',
};

const servicesList = {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
};

const serviceItem = {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#374151',
    marginBottom: '12px',
    display: 'block',
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