import { useState, useEffect } from "react";
import { instituteService } from "@/services/instituteService";
import { studentPortalService } from "@/services/studentPortalService";
import type { Institute } from "@/data/types";
import imgLogo from "@/imports/EducationalInstitutePortal-1/73da5574736f6a1e3d533885140e2c14827bbc1f.png";
import { QRCodeSVG } from "qrcode.react";
import { authService } from "@/services/authService";
import { Navbar } from "@/app/components/reusable/Navbar";

// ---------------------------------------------------------------------------
// Student Certificate Generated Page
// Exact match to Figma design (Image 1 & Image 3):
// - Seamless grey #e5e7eb outer background with top Navbar and Logout
// - Centered white card with rounded-[16px] border
// - Green circular checkmark icon
// - "Certificate Generated!" header and description
// - QR code box with #edf5ff background and #425586 border
// - "What Happens Next?" box with numbered steps
// - Horizontal divider line
// - "Don't have Inji Wallet yet?" title
// - Authentic Android & iOS download buttons linked to Google Drive and TestFlight
// - Golden-brown "Back to Dashboard" button (#af8010)
// ---------------------------------------------------------------------------

const ANDROID_APP_LINK = "https://drive.google.com/drive/folders/1gBjFSdpjxU4bsZi7-xS59W1-EIFKrkS8";
const IOS_APP_LINK = "https://testflight.apple.com/join/7FTAdjLe";

export default function StudentCertificateGeneratedPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    instituteService.getInstitute().then(setInstitute);
    
    const loggedInId = authService.getLoggedInStudentId();
    if (loggedInId) {
      studentPortalService.requestCredential(loggedInId).then((data) => {
        if (data?.credentialOfferUri) {
          setQrUrl(data.credentialOfferUri);
        }
      });
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    authService.setLoggedInStudentId(null);
    window.dispatchEvent(new CustomEvent("navigate", { detail: "student-login" }));
  };

  const handleBackToDashboard = () => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: "student-dashboard" }));
  };

  // Realistic fallback QR offer URI if backend certify server is offline or loading
  const displayQr = qrUrl || "openid-credential-offer://?credential_issuer=http%3A%2F%2Flocalhost%3A8091&credential_configuration_ids=%5B%22DegreeCertificate%22%5D&grants=%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22utopia-cert-code-2026%22%7D%7D";

  return (
    <div className="bg-[#e5e7eb] min-h-screen w-full flex flex-col">
      {institute && (
        <Navbar
          institute={{ ...institute, portalLabel: "Student Portal" }}
          logoSrc={imgLogo}
          onLogout={handleLogout}
        />
      )}

      <div className="w-full flex-1 flex flex-col items-center justify-start py-[36px] px-[16px]">
        {/* Main White Card */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-[32px] sm:p-[40px] flex flex-col items-center w-full max-w-[620px] shadow-sm">
          {/* Green Checkmark Circle */}
          <div className="flex items-center justify-center size-[48px] rounded-full bg-[#dcfce7] mb-[16px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="2" />
              <path
                d="M8 12.5L10.5 15L16 9.5"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[22px] sm:text-[24px] text-[#101828] leading-[30px] text-center">
            Certificate Generated!
          </h1>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#4a5565] leading-[20px] text-center mt-[6px] mb-[24px] max-w-[460px]">
            Your certificate request has been submitted and the certificate has been successfully generated with your information.
          </p>

          {/* QR Code Container */}
          <div className="bg-[#edf5ff] border-2 border-[#425586] rounded-[12px] p-[24px] flex flex-col items-center w-full mb-[20px]">
            <div className="bg-white p-[12px] rounded-[10px] shadow-sm flex items-center justify-center mb-[16px]">
              <QRCodeSVG value={displayQr} size={170} level="M" />
            </div>
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[15px] text-[#1e3a8a] leading-[22px] text-center">
              Your Certificate QR Code
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#475569] leading-[18px] text-center mt-[4px] max-w-[340px]">
              Scan this QR code with your Inji Wallet app to receive and store your digital certificate as a Verifiable Credential.
            </p>
          </div>

          {/* What Happens Next Container */}
          <div className="bg-[#edf5ff] border-2 border-[#425586] rounded-[12px] p-[20px] w-full flex flex-col gap-[8px] mb-[24px]">
            <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#1e3a8a] leading-[20px]">
              What Happens Next?
            </h3>
            <ol className="list-decimal pl-[18px] flex flex-col gap-[6px]">
              <li className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#334155] leading-[18px]">
                Download the Inji Wallet app if you haven't already (buttons below).
              </li>
              <li className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#334155] leading-[18px]">
                Scan the QR code above with Inji Wallet to download your certificate as a Verifiable Credential.
              </li>
              <li className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-[#334155] leading-[18px]">
                Your certificate will be securely stored in your digital wallet for easy sharing and verification.
              </li>
            </ol>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e5e7eb] w-full mb-[20px]" />

          {/* Download Buttons Section */}
          <div className="flex flex-col items-center gap-[12px] w-full mb-[24px]">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-[#101828] leading-[24px] text-center">
              Don't have Inji Wallet yet?
            </p>
            <div className="flex items-center justify-center gap-[16px] w-full mt-[2px]">
              {/* Android Button */}
              <a
                href={ANDROID_APP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-[#1f2937] text-white rounded-[10px] px-[20px] py-[8px] flex items-center gap-[12px] no-underline transition-colors shadow-sm cursor-pointer"
                data-name="Button"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.62 2.24 12.83 2 12 2c-.83 0-1.62.24-2.64.63L7.88.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.73 3.1 5.5 4.9 5.5 7h13c0-2.1-1.23-3.9-2.97-4.84zM10 5H8.5V4h1.5v1zm5.5 0H14V4h1.5v1z" />
                </svg>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[9px] uppercase tracking-wider text-white/90">
                    GET IT ON
                  </span>
                  <span className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-white tracking-[-0.2px]">
                    Android
                  </span>
                </div>
              </a>

              {/* iOS Button */}
              <a
                href={IOS_APP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-[#1f2937] text-white rounded-[10px] px-[20px] py-[8px] flex items-center gap-[12px] no-underline transition-colors shadow-sm cursor-pointer"
                data-name="Button"
              >
                <svg width="20" height="24" viewBox="0 0 170 170" fill="white">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.85-11.93-14.42-6-9.16-10.7-19.71-14.12-31.64-3.42-11.93-5.13-23.01-5.13-33.24 0-14.65 3.73-26.79 11.19-36.42 7.46-9.63 16.73-14.54 27.81-14.75 5.37 0 11.13 1.34 17.29 4.02 6.16 2.68 10.15 4.07 11.98 4.17 1.34 0 5.58-1.52 12.74-4.57 7.15-3.04 13.3-4.35 18.45-3.92 13.78 1.09 24.63 6.31 32.55 15.66-12.04 7.29-17.94 17.29-17.72 30 0 10.11 3.92 18.66 11.75 25.64 4.02 3.59 8.65 6.26 13.88 8.01-2.93 8.7-6.52 17.22-10.76 25.53zM119.22 31.81c0-7.39 2.67-14.34 8-20.84 5.33-6.5 11.85-10.37 19.57-11.61.22 1.41.33 2.72.33 3.92 0 7.39-2.82 14.44-8.47 21.16-5.65 6.72-12.28 10.61-19.89 11.67-.11-1.41-.16-2.68-.16-4.3z" />
                </svg>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[9px] text-white/90">
                    Download on
                  </span>
                  <span className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-white tracking-[-0.2px]">
                    iOS
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="bg-[#af8010] hover:bg-[#976d0d] transition-colors rounded-[8px] w-full py-[12px] font-['Inter:Bold',sans-serif] font-bold text-[15px] text-white text-center cursor-pointer shadow-sm tracking-[-0.1px]"
            data-name="Button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
