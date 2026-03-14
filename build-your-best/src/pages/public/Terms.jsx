import { useEffect } from 'react';
import { FaBalanceScale, FaBook, FaGavel, FaExchangeAlt, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';

export default function TermsAndConditions() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
  return (
    <div className="bg-[#F5EFE7] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/90 text-[#B76E79] px-4 py-1 rounded-full mb-4">
           
            <span className="text-sm font-medium">LEGAL TERMS</span>
          </div>
          <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79] text-2xl md:text-4xl lg:text-5xl font-bold">
            Terms & Conditions
          </h1>
          <p className="text-xl text-[#5A5A5A] max-w-3xl mx-auto">
            The rules governing our coaching services and website use
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="relative py-5 md:py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg text-[#5A5A5A]">
            <p className="text-lg mb-8">
              These Terms and Conditions ("Terms") govern your use of BYBS Coaching's 
              website and services. By accessing our services, you agree to these Terms. 
              Please read them carefully.
            </p>

            <div className="space-y-12">
              {/* Service Description */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">1. Service Overview</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    BYBS Coaching provides:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>One-on-one coaching sessions (in-person, phone, or video)</li>
                    <li>Group coaching programs</li>
                    <li>Digital products (workbooks, courses, etc.)</li>
                    <li>Educational content via blog, emails, and social media</li>
                  </ul>
                  <p>
                    Coaching is not therapy, counseling, or mental health care. We do not 
                    diagnose or treat mental health conditions.
                  </p>
                </div>
              </div>

              {/* Client Responsibilities */}
              <div>
                <div className="flex items-center mb-6">
                
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">2. Client Responsibilities</h2>
                </div>
                <div className="space-y-4">
                  <p>As a client, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate information about your background and goals</li>
                    <li>Attend sessions on time and give 24-hour notice for cancellations</li>
                    <li>Complete assigned exercises between sessions</li>
                    <li>Take responsibility for your decisions and progress</li>
                    <li>Maintain confidentiality of group coaching participants</li>
                  </ul>
                  <p>
                    Coaching requires your active participation. Results depend on your 
                    commitment to the process.
                  </p>
                </div>
              </div>

              {/* Payments & Refunds */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">3. Payments & Refunds</h2>
                </div>
                <div className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Fees:</strong> All prices are in USD. Coaching packages must be 
                      paid in full or per agreed payment plan before sessions begin.
                    </li>
                    <li>
                      <strong>Late Payments:</strong> Services may be paused for payments overdue 
                      by more than 7 days.
                    </li>
                    <li>
                      <strong>Refunds:</strong> Single sessions are non-refundable. Package 
                      refunds are prorated minus a 10% administrative fee if canceled within 
                      3 days of purchase. After 3 days, no refunds are given for unused sessions.
                    </li>
                    <li>
                      <strong>Digital Products:</strong> Due to their nature, all digital 
                      product sales are final.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Intellectual Property */}
              <div>
                <div className="flex items-center mb-6">
             
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">4. Intellectual Property</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    All materials provided (workbooks, worksheets, videos, etc.) are for 
                    your personal use only. You agree not to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Share, reproduce, or distribute materials without permission</li>
                    <li>Teach or coach others using our proprietary methods</li>
                    <li>Claim our materials as your own</li>
                  </ul>
                  <p>
                    All website content, logos, and branding are owned by BYBS Coaching 
                    and protected by copyright laws.
                  </p>
                </div>
              </div>

              {/* Limitations */}
              <div>
                <div className="flex items-center mb-6">
                 
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">5. Limitations of Liability</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    BYBS Coaching makes no guarantees about specific results. Coaching 
                    success depends on your participation and effort.
                  </p>
                  <p>
                    We are not liable for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Decisions or actions you take based on coaching</li>
                    <li>Technical issues beyond our control (e.g., internet outages)</li>
                    <li>Any unauthorized access to your data despite our security measures</li>
                  </ul>
                </div>
              </div>

              {/* Termination */}
              <div>
                <div className="flex items-center mb-6">
                 
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">6. Termination</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    We reserve the right to terminate services if:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You violate these Terms</li>
                    <li>There is abusive behavior or harassment</li>
                    <li>Payment obligations are not met</li>
                  </ul>
                  <p>
                    You may terminate services at any time, subject to our refund policy.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">7. Governing Law</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    These Terms are governed by California law. Any disputes will be 
                    resolved in San Francisco County courts.
                  </p>
                  <p>
                    If any provision is found invalid, the remaining provisions remain 
                    in full effect.
                  </p>
                </div>
              </div>

              {/* Changes */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">8. Changes to Terms</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    We may update these Terms periodically. The current version will always 
                    be posted here with the effective date. Continued use after changes 
                    constitutes acceptance.
                  </p>
                  <p>
                    <strong>Last Updated:</strong> July 15, 2023
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center mb-6">
                  
                  <h2 className="text-2xl font-bold text-[#3A3A3A]">9. Contact Us</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    For questions about these Terms:
                  </p>
                  <p>
                    <strong>Email:</strong> legal@buildyourbestself.com<br />
                    
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
            <FaBalanceScale className="text-4xl mx-auto text-[#B76E79] mb-4" />
            <h3 className="text-xl font-bold text-[#3A3A3A] mb-2">
              Clear Understanding
            </h3>
            <p className="text-[#5A5A5A]">
              These Terms exist to protect both parties and ensure a positive coaching 
              experience. We're happy to clarify any points before you begin working with us.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}