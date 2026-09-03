import React from 'react';
import Link from 'next/link';
import MixedGrid from '../components/MixedGrid';

const PrivacyPolicy: React.FC = () => {
  return (
    <MixedGrid>
      <div className="bg-gray-200 rounded-xl p-6 mb-6 text-justify mx-auto w-full shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Privacy Policy for Super Heroes Legacy
        </h1>

        <p className="text-gray-800 mb-4">
          At Super Heroes Legacy, accessible from https://houseofheroes.dev, the privacy of our users is of utmost importance to us.
          This Privacy Policy outlines the types of information we collect and how it is used. By using our app, you agree to the practices
          described in this policy.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">1. Information We Collect</h2>
        <p className="text-gray-800 mb-4">
          To provide our service, we collect and process the following types of information:
        </p>
        <ul className="list-disc pl-5 text-gray-800 mb-4">
          <li>
            <strong>Account Information:</strong> When you create an account, we ask for your username (which can be a pseudonym),
            email address, and a password. This information is used to create and manage your account.
          </li>
          <li>
            <strong>Comic Collections:</strong> You can create and manage your personal comic book collections. These collections are private 
            and only visible to you unless otherwise stated.
          </li>
          <li>
            <strong>Activity Information:</strong> You can mark which comics you have read. This data is stored in your account and is not shared publicly.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect information about how you interact with our app, such as device information (IP address,
            browser type), time spent on the app, and interactions within the app. This information helps us improve our service.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">2. How We Use Your Information</h2>
        <p className="text-gray-800 mb-4">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc pl-5 text-gray-800 mb-4">
          <li>To create and manage your user account.</li>
          <li>To provide you with personalized content, such as recommendations based on your comic collection.</li>
          <li>To improve the functionality and user experience of our app.</li>
          <li>To communicate with you regarding your account, changes in our services, or updates.</li>
          <li>To detect and prevent fraudulent activities.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">3. Cookies and Tracking Technologies</h2>
        <p className="text-gray-800 mb-4">
          We use cookies and similar tracking technologies to:
        </p>
        <ul className="list-disc pl-5 text-gray-800 mb-4">
          <li>Remember your login details and preferences.</li>
          <li>Provide a more personalized experience by tracking your interactions with the app.</li>
        </ul>
        <p className="text-gray-800 mb-4">
          You can choose to disable cookies through your browser settings, but doing so may limit your ability to use some features of the app.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">4. How We Share Your Information</h2>
        <p className="text-gray-800 mb-4">
          We do not sell or share your personal information with third parties except in the following cases:
        </p>
        <ul className="list-disc pl-5 text-gray-800 mb-4">
          <li>
            <strong>Service Providers:</strong> We may share your information with trusted third-party service providers who assist in
            operating our app (e.g., hosting services). These providers are contractually obligated to protect your data.
          </li>
          <li>
            <strong>Legal Compliance:</strong> We may share your information if required by law or if necessary to protect the rights and
            safety of our users or others.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">5. Data Security</h2>
        <p className="text-gray-800 mb-4">
          We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect
          your data from unauthorized access, loss, or misuse. However, no security system is completely impenetrable, and we cannot guarantee
          the absolute security of your data.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">6. Your Data Rights</h2>
        <p className="text-gray-800 mb-4">
          As a user, you have the following rights concerning your data:
        </p>
        <ul className="list-disc pl-5 text-gray-800 mb-4">
          <li>
            <strong>Access:</strong> You have the right to request a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> You can request that we update or correct any inaccuracies in your personal data.
          </li>
          <li>
            <strong>Deletion:</strong> You can request that we delete your personal data from our systems. However, some data may be retained for legal or administrative purposes.
          </li>
          <li>
            <strong>Data Portability:</strong> You can request a copy of the data you provided in a structured, machine-readable format.
          </li>
          <li>
            <strong>Opt-out of Marketing:</strong> You can opt out of receiving marketing emails from us at any time.
          </li>
        </ul>
        <p className="text-gray-800 mb-4">
          To exercise these rights, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">7. Retention of Information</h2>
        <p className="text-gray-800 mb-4">
          We will retain your information as long as your account is active or as necessary to provide our services. We may also retain and use
          your information to comply with legal obligations, resolve disputes, and enforce our agreements.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">8. Children’s Privacy</h2>
        <p className="text-gray-800 mb-4">
          Our app is not directed toward children under the age of 13, and we do not knowingly collect personal information from children. If
          we discover that a child under 13 has provided us with personal information, we will delete such information immediately.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">9. Changes to This Policy</h2>
        <p className="text-gray-800 mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and if they are significant, we will notify
          you via email or in-app notifications. By continuing to use the app after the changes take effect, you agree to the revised policy.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-4 text-black">10. Contact Us</h2>
        <p className="text-gray-800 mb-4">
          If you have any questions or concerns about this Privacy Policy, please{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
        </p>
      </div>
    </MixedGrid>
  );
};

export default PrivacyPolicy;
