import React from 'react';
import MixedGrid from '../components/MixedGrid';
import Link from 'next/link';

const TermsOfUse: React.FC = () => {
  return (
    <MixedGrid>
      <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-auto w-full shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Terms of Use for House of Heroes
        </h1>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">1. Acceptance of Terms</h2>
        <p className="text-md mb-4 text-gray-800">
          By accessing or using the House of Heroes app, you agree to be bound by these Terms of Use. 
          If you do not agree to these terms, you should not use the app.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">2. User Accounts</h2>
        <p className="text-md mb-4 text-gray-800">
          To use certain features of the app, you may be required to create an account. When creating an account, you must provide 
          accurate and complete information, including a valid email address. You are responsible for maintaining the confidentiality 
          of your account credentials, and you are responsible for all activities that occur under your account.
        </p>

        <h3 className="text-xl font-bold mt-4 mb-2 text-black">2.1. Account Termination</h3>
        <p className="text-md mb-4 text-gray-800">
          House of Heroes reserves the right to suspend or terminate your account if you violate any part of these Terms of Use.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">3. User Content</h2>
        <p className="text-md mb-4 text-gray-800">
          House of Heroes allows you to create and manage collections of comic books and track your reading progress. Any content 
          you add, including your personal comic collections, is considered your property, but by using the app, you grant us permission 
          to store this information for the purpose of providing our services.
        </p>

        <h3 className="text-xl font-bold mt-4 mb-2 text-black">3.1. Private Collections</h3>
        <p className="text-md mb-4 text-gray-800">
          Your comic collections and reading progress are private and will not be shared publicly unless you expressly choose to do so.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">4. Intellectual Property</h2>
        <h3 className="text-xl font-bold mt-4 mb-2 text-black">4.1. App Content</h3>
        <p className="text-md mb-4 text-gray-800">
          All content, features, functionality, and design elements of the House of Heroes app (excluding user-generated content) 
          are the exclusive intellectual property of House of Heroes. This includes the code, logos, designs, and user interfaces.
        </p>
        <p className="text-md mb-4 text-gray-800">
          You may not reproduce, distribute, modify, or create derivative works from any part of the app without our explicit permission.
        </p>

        <h3 className="text-xl font-bold mt-4 mb-2 text-black">4.2. Images and Artwork</h3>
        <p className="text-md mb-4 text-gray-800">
          All images, characters, and related intellectual property are owned by their respective copyright holders, including Marvel, DC, 
          and other comic book publishers. These images are used under fair use for informational and promotional purposes. House of Heroes 
          is not affiliated with Marvel, DC, or any other comic book publishers.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">5. Prohibited Activities</h2>
        <p className="text-md mb-4 text-gray-800">
          When using House of Heroes, you agree not to:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-800">
          <li>Use the app for any illegal or unauthorized purpose.</li>
          <li>Exploit, harm, or attempt to exploit or harm minors in any way.</li>
          <li>Transmit any worms or viruses or any code of a destructive nature.</li>
          <li>Use the app to spam, phish, or otherwise harm the platform or its users.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">6. Third-Party Links</h2>
        <p className="text-md mb-4 text-gray-800">
          The app may contain links to third-party websites or services that are not owned or controlled by House of Heroes. We have no control 
          over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">7. Disclaimer of Warranties</h2>
        <p className="text-md mb-4 text-gray-800">
          House of Heroes provides the app on an “as is” and “as available” basis. We do not warrant that the app will be uninterrupted, secure, 
          or free of errors. You agree that your use of the app is at your sole risk.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">8. Limitation of Liability</h2>
        <p className="text-md mb-4 text-gray-800">
          To the fullest extent permitted by applicable law, House of Heroes and its affiliates, officers, employees, or licensors shall not 
          be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, damages for loss of 
          profits, goodwill, data, or other intangible losses arising from your use of the app.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">9. Changes to Terms</h2>
        <p className="text-md mb-4 text-gray-800">
          House of Heroes reserves the right, at our sole discretion, to modify or replace these Terms of Use at any time. If a revision is 
          material, we will notify you via email or within the app. By continuing to use the app after the changes take effect, you agree to 
          be bound by the revised terms.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">10. Contact Us</h2>
        <p className="text-md mb-4 text-gray-800">
          If you have any questions or concerns about these Terms of Use, please contact us through our{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            contact form
          </Link>.
        </p>
      </div>
    </MixedGrid>
  );
};

export default TermsOfUse;
