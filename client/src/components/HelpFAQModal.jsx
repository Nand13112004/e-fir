import { useTranslation } from 'react-i18next';

export default function HelpFAQModal({ isOpen, onClose }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-govBlue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">📘 Help Section & FAQ</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-govGray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Help Section */}
          <section>
            <h3 className="text-xl font-bold text-govGray-800 mb-4">📘 Help Section</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-govGray-800 mb-2">1. What is the E-Court Communication Portal?</h4>
                <p className="text-govGray-600 text-sm leading-relaxed">
                  This portal is designed to allow Police Officers and Judges to communicate securely regarding case updates, requests, and approvals. It ensures faster coordination and transparent digital workflow.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-govGray-800 mb-2">2. Who can use this portal?</h4>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1">
                  <li><strong>Police Officers</strong> – Submit case reports, complaints, evidence, and request approvals.</li>
                  <li><strong>Judges</strong> – View police submissions, approve/reject actions, and send responses.</li>
                  <li><strong>Admins</strong> – Manage users, departments, and access permissions.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-govGray-800 mb-2">3. What can Police do in the portal?</h4>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1">
                  <li>Login with provided credentials</li>
                  <li>Create & submit case requests</li>
                  <li>Upload FIR, evidence PDFs, images</li>
                  <li>Chat securely with Judge</li>
                  <li>View status: Pending / Approved / Rejected</li>
                  <li>Update case details</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-govGray-800 mb-2">4. What can Judges do?</h4>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1">
                  <li>View case submissions from Police</li>
                  <li>Approve / Reject with remarks</li>
                  <li>Send instructions or queries</li>
                  <li>Track complete case history</li>
                  <li>Download submitted files</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-govGray-800 mb-2">5. Upload Requirements</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-govGray-300 text-sm">
                    <thead className="bg-govGray-100">
                      <tr>
                        <th className="border border-govGray-300 px-4 py-2 text-left">Type</th>
                        <th className="border border-govGray-300 px-4 py-2 text-left">Allowed Formats</th>
                        <th className="border border-govGray-300 px-4 py-2 text-left">Max Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-govGray-300 px-4 py-2">Documents</td>
                        <td className="border border-govGray-300 px-4 py-2">PDF</td>
                        <td className="border border-govGray-300 px-4 py-2">10MB</td>
                      </tr>
                      <tr>
                        <td className="border border-govGray-300 px-4 py-2">Images</td>
                        <td className="border border-govGray-300 px-4 py-2">JPG/PNG</td>
                        <td className="border border-govGray-300 px-4 py-2">5MB</td>
                      </tr>
                      <tr>
                        <td className="border border-govGray-300 px-4 py-2">Evidence Videos</td>
                        <td className="border border-govGray-300 px-4 py-2">MP4</td>
                        <td className="border border-govGray-300 px-4 py-2">50MB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-govGray-800 mb-2">6. What to do if login fails?</h4>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1">
                  <li>Check if username/password is correct</li>
                  <li>Ensure CAPS LOCK is OFF</li>
                  <li>Contact Admin to reset your password</li>
                  <li>Network error → try again after few minutes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="border-t border-govGray-200 pt-8">
            <h3 className="text-xl font-bold text-govGray-800 mb-4">🟦 Frequently Asked Questions (FAQ)</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q1: How to submit a new case?</h4>
                <ol className="list-decimal list-inside text-govGray-600 text-sm space-y-1 ml-4">
                  <li>Login as Police</li>
                  <li>Go to Requests → New Request</li>
                  <li>Fill case details</li>
                  <li>Attach required documents</li>
                  <li>Click Submit</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q2: How to check the status of my case?</h4>
                <p className="text-govGray-600 text-sm mb-2">Go to Requests Page → find your case. You will see:</p>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1 ml-4">
                  <li>🟡 Pending</li>
                  <li>🟢 Approved</li>
                  <li>🔴 Rejected</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q3: Can I edit a submitted case?</h4>
                <p className="text-govGray-600 text-sm">
                  Yes — but only until the Judge reviews it. Once status = Approved, editing is locked.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q4: How does communication work?</h4>
                <p className="text-govGray-600 text-sm">
                  You can send messages or clarifications through the Case Chat inside the request. Judge replies appear in real-time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q5: How to reset my password?</h4>
                <p className="text-govGray-600 text-sm">
                  Go to Profile → Reset Password OR Ask Admin to generate a new password.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q6: How to upload multiple files?</h4>
                <p className="text-govGray-600 text-sm">
                  Click Add More Files button on the upload section. You can upload multiple PDFs/photos as part of evidence.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q7: Why is my file upload failing?</h4>
                <p className="text-govGray-600 text-sm mb-2">Common reasons:</p>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1 ml-4">
                  <li>File size too large</li>
                  <li>Unsupported format</li>
                  <li>Slow internet connection</li>
                  <li>Server timeout (try again)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q8: Can Judge download Police reports?</h4>
                <p className="text-govGray-600 text-sm mb-2">Yes. Judges can download:</p>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1 ml-4">
                  <li>FIR</li>
                  <li>Evidence</li>
                  <li>Uploaded files</li>
                  <li>Case summary</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-govBlue-600 mb-2">🔹 Q9: Is my data safe?</h4>
                <p className="text-govGray-600 text-sm mb-2">Yes, all communication is:</p>
                <ul className="list-disc list-inside text-govGray-600 text-sm space-y-1 ml-4">
                  <li>HTTPS encrypted</li>
                  <li>Stored securely in MongoDB</li>
                  <li>Accessible only by authorized users</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-govGray-100 px-6 py-4 border-t border-govGray-200 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

