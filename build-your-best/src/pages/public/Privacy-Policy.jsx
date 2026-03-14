import { useEffect } from 'react';
import { FaShieldAlt, FaLock, FaUserCheck, FaEnvelope, FaServer } from 'react-icons/fa';

export default function PrivacyPolicy() {
    useEffect(() =>{
        window.scrollTo(0, 0)
    }, [])
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/90 text-[#B76E79] px-4 py-1 rounded-full mb-4">
            <FaShieldAlt className="mr-2" />
            <span className="text-sm font-medium">YOUR PRIVACY MATTERS</span>
          </div>
          <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79] text-2xl md:text-4xl lg:text-5xl font-bold">
            Privacy Policy
          </h1>
          <p className="text-xl text-[#5A5A5A] max-w-3xl mx-auto">
            How we protect and use your information
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="relative py-5 md:py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg text-[#5A5A5A]">
            <p className="text-lg mb-8">
              At BYBS Coaching ("we," "us," or "our"), we are committed to protecting your privacy. 
              This policy explains how we collect, use, and safeguard your personal information when 
              you use our website and services.
            </p>

            <div className="space-y-12">
              {/* Information Collection */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">1. Information We Collect</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    We may collect the following types of information when you interact with our services:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Personal Identification:</strong> Name, email address, phone number when 
                      you book services or sign up for our newsletter
                    </li>
                    <li>
                      <strong>Payment Information:</strong> Credit card details processed securely 
                      through our payment processor (we don't store full card numbers)
                    </li>
                    <li>
                      <strong>Technical Data:</strong> IP address, browser type, device information, 
                      and usage data through cookies
                    </li>
                    <li>
                      <strong>Coaching Information:</strong> Notes from sessions, goals, and progress 
                      tracking (kept confidential)
                    </li>
                  </ul>
                </div>
              </div>

              {/* How We Use Information */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">2. How We Use Your Information</h2>
                </div>
                <div className="space-y-4">
                  <p>We use collected information to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and personalize our coaching services</li>
                    <li>Process payments and send service-related communications</li>
                    <li>Improve our website and services through analytics</li>
                    <li>Send periodic emails (you can unsubscribe at any time)</li>
                    <li>Comply with legal obligations and protect against fraud</li>
                  </ul>
                  <p>
                    We will never sell your personal information to third parties. 
                    Confidential coaching conversations remain private except where 
                    required by law.
                  </p>
                </div>
              </div>

              {/* Data Protection */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">3. Data Protection</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    We implement appropriate security measures including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>SSL encryption for all data transmissions</li>
                    <li>Secure storage with access limited to authorized personnel</li>
                    <li>Regular security audits of our systems</li>
                    <li>Password protection and two-factor authentication</li>
                  </ul>
                  <p>
                    While we take reasonable precautions, no internet transmission is 100% secure. 
                    We cannot guarantee absolute security but we strive to use commercially 
                    acceptable means to protect your data.
                  </p>
                </div>
              </div>

              {/* Cookies */}
              <div>
                <div className="flex items-center mb-6">
                 
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">4. Cookies & Tracking</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    Our website uses cookies to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Enhance user experience and remember preferences</li>
                    <li>Analyze site traffic and performance</li>
                    <li>Enable certain functionality like payment processing</li>
                  </ul>
                  <p>
                    You can disable cookies in your browser settings, but some features 
                    may not function properly. We use Google Analytics to understand how 
                    visitors use our site.
                  </p>
                </div>
              </div>

              {/* Third Parties */}
              <div>
                <div className="flex items-center mb-6">
                 
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">5. Third-Party Services</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    We use trusted third-party services that may process your data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Payment Processing:</strong> Stripe (PCI compliant)</li>
                    <li><strong>Email Marketing:</strong> Mailchimp (opt-out available)</li>
                    <li><strong>Scheduling:</strong> Calendly or Acuity Scheduling</li>
                    <li><strong>Video Conferencing:</strong> Zoom (end-to-end encrypted)</li>
                  </ul>
                  <p>
                    These providers have their own privacy policies governing data use. 
                    We only work with services that meet GDPR and other privacy standards.
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div>
                <div className="flex items-center mb-6">
               
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">6. Your Rights</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access, update, or delete your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request restriction of processing</li>
                    <li>Data portability (receive your data in a readable format)</li>
                    <li>Withdraw consent where processing is consent-based</li>
                  </ul>
                  <p>
                    To exercise these rights, contact us at privacy@bybscoaching.com. 
                    We may need to verify your identity before processing requests.
                  </p>
                </div>
              </div>

              {/* Policy Updates */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">7. Policy Updates</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    We may update this policy periodically. The current version will always 
                    be posted here with the effective date. Material changes will be 
                    communicated via email or prominent website notice.
                  </p>
                  <p>
                    <strong>Last Updated:</strong> July 15, 2023
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">8. Contact Us</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    For questions about this privacy policy or your personal data:
                  </p>
                  <p>
                    <strong>Email:</strong> privacy@bybscoaching.com<br />
                    <strong>Mailing Address:</strong> BYBS Coaching, 123 Wellness Way, Suite 100, San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Note */}
      <section className="py-12 bg-[#F5EFE7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm">
           
            <h3 className="text-xl font-bold text-[#3A3A3A] mb-2">
              Committed to Your Privacy
            </h3>
            <p className="text-[#5A5A5A]">
              We take your trust seriously. Our privacy practices exceed standard 
              requirements to protect your sensitive information, especially 
              regarding coaching conversations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}