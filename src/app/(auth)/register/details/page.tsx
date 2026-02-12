"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/utils";

type UserType = "individual" | "company";

interface UploadedFile {
  file: File | null;
  preview: string | null;
  fileName: string;
}

const RegisterDetailsPage: React.FC = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("individual");
  const [currentStep, setCurrentStep] = useState<"type" | "details" | "otp">(
    "type",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Individual fields
  const [individualName, setIndividualName] = useState("");
  const [individualPhone, setIndividualPhone] = useState("");

  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  // Documents
  const [individualDocs, setIndividualDocs] = useState<{
    idCopy: UploadedFile;
    proofOfResidence: UploadedFile;
    logo: UploadedFile;
  }>({
    idCopy: { file: null, preview: null, fileName: "" },
    proofOfResidence: { file: null, preview: null, fileName: "" },
    logo: { file: null, preview: null, fileName: "" },
  });

  const [companyDocs, setCompanyDocs] = useState<{
    companyLogo: UploadedFile;
    companyRegistration: UploadedFile;
    directorIds: Array<{ file: File; preview: string; fileName: string }>;
    proofOfResidence: Array<{ file: File; preview: string; fileName: string }>;
  }>({
    companyLogo: { file: null, preview: null, fileName: "" },
    companyRegistration: { file: null, preview: null, fileName: "" },
    directorIds: [],
    proofOfResidence: [],
  });

  // OTP state
  const [otp, setOtp] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // --- Handlers (Full Logic Restored) ---

  const handleFileUpload = (
    field: "idCopy" | "proofOfResidence" | "logo",
    file: File | null,
  ) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024)
        return alert("File size must be less than 10MB");
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      setIndividualDocs((prev) => ({
        ...prev,
        [field]: { file, preview, fileName: file.name },
      }));
    }
  };

  const handleCompanyFileUpload = (
    field: "companyLogo" | "companyRegistration",
    file: File | null,
  ) => {
    if (file) {
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      setCompanyDocs((prev) => ({
        ...prev,
        [field]: { file, preview, fileName: file.name },
      }));
    }
  };

  const handleArrayFileUpload = (
    files: FileList | null,
    field: "directorIds" | "proofOfResidence",
  ) => {
    if (files) {
      const fileArray = Array.from(files).map((file) => ({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
        fileName: file.name,
      }));
      setCompanyDocs((prev) => ({
        ...prev,
        [field]: [...prev[field], ...fileArray],
      }));
    }
  };

  const removeArrayFile = (
    index: number,
    field: "directorIds" | "proofOfResidence",
  ) => {
    setCompanyDocs((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    
    if (!email || !email.includes("@")) {
      errors.email = "Please enter a valid email address";
    }
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitDetails = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setCurrentStep("otp");
  };

  const renderFileUpload = (
    label: string,
    file: UploadedFile,
    onChange: (f: File | null) => void,
    required = false,
  ) => (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold text-muted-foreground uppercase ml-1">
        {label} {required && "*"}
      </label>
      <div className="border border-dashed rounded-xl p-3 text-center border-border bg-muted/30 hover:border-accent transition-all cursor-pointer relative">
        <input
          type="file"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
        {file.fileName ? (
          <div className="flex items-center justify-between text-[10px] text-accent font-bold">
            <span className="truncate max-w-[90px]">{file.fileName}</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={(e) =>
              (
                e.currentTarget.previousElementSibling as HTMLInputElement
              ).click()
            }
            className="py-1"
          >
            <Icons.Upload
              size={14}
              className="mx-auto text-muted-foreground mb-1"
            />
            <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">
              Upload
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col h-full">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* --- Header --- */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight italic">
          Create Account
        </h2>
        <p className="text-muted-foreground text-xs">
          Register to start advertising on TESE.
        </p>
      </div>

      {/* --- Stepper: Full Stretched --- */}
      <div className="flex items-center justify-between mb-8 w-full">
        {[
          { id: "type", label: "Type" },
          { id: "details", label: "Details" },
          { id: "otp", label: "Verify" },
        ].map((step, idx, arr) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
                  currentStep === step.id
                    ? "bg-accent border-accent text-accent-foreground"
                    : arr.findIndex((s) => s.id === currentStep) > idx
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted",
                )}
              >
                {arr.findIndex((s) => s.id === currentStep) > idx
                  ? "✓"
                  : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-widest",
                  currentStep === step.id ? "text-foreground" : "text-muted",
                )}
              >
                {step.label}
              </span>
            </div>
            {idx !== arr.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[1px] mb-5 mx-2",
                  arr.findIndex((s) => s.id === currentStep) > idx
                    ? "bg-primary"
                    : "bg-border",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* --- Main Body --- */}
      <div className="flex-1">
        {currentStep === "type" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-3">
              <button
                onClick={() => setUserType("individual")}
                className={cn(
                  "w-full p-4 rounded-xl border text-left transition-all",
                  userType === "individual"
                    ? "bg-accent/10 border-accent"
                    : "bg-muted/50 border-border",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Icons.Users
                      size={20}
                      className={
                        userType === "individual"
                          ? "text-accent"
                          : "text-muted-foreground"
                      }
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground italic text-sm">
                      Individual
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Personal ad management
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUserType("company")}
                className={cn(
                  "w-full p-4 rounded-xl border text-left transition-all",
                  userType === "company"
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/50 border-border",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Icons.Campaign
                      size={20}
                      className={
                        userType === "company"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground italic text-sm">
                      Company
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Scale your business ads
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setCurrentStep("details")}
                className="w-full font-bold h-10 text-sm"
              >
                Continue
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        )}

        {currentStep === "details" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
            <button
              onClick={() => setCurrentStep("type")}
              className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-all uppercase"
            >
              <Icons.ArrowLeft size={14} /> Change Account Type
            </button>

            <div className="grid grid-cols-2 gap-3">
              {userType === "individual" ? (
                <>
                  <div className="col-span-2">
                    <Input
                      label="Full Name"
                      value={individualName}
                      onChange={(e) => setIndividualName(e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Phone"
                      value={individualPhone}
                      onChange={(e) => setIndividualPhone(e.target.value)}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="col-span-1">
                    {renderFileUpload(
                      "ID Copy",
                      individualDocs.idCopy,
                      (f) => handleFileUpload("idCopy", f),
                      true,
                    )}
                  </div>
                  <div className="col-span-1">
                    {renderFileUpload(
                      "Residence",
                      individualDocs.proofOfResidence,
                      (f) => handleFileUpload("proofOfResidence", f),
                      true,
                    )}
                  </div>
                  <div className="col-span-2">
                    {renderFileUpload(
                      "Personal Logo",
                      individualDocs.logo,
                      (f) => handleFileUpload("logo", f),
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <Input
                      label="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Ltd"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="Contact Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="Company Phone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="col-span-1">
                    {renderFileUpload(
                      "Logo",
                      companyDocs.companyLogo,
                      (f) => handleCompanyFileUpload("companyLogo", f),
                      true,
                    )}
                  </div>
                  <div className="col-span-1">
                    {renderFileUpload(
                      "Reg Doc",
                      companyDocs.companyRegistration,
                      (f) => handleCompanyFileUpload("companyRegistration", f),
                      true,
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                      Director IDs *
                    </label>
                    <div
                      onClick={() =>
                        (document.getElementById("dir-ids") as any).click()
                      }
                      className="border border-dashed border-border rounded-xl p-2 bg-muted/30 text-center cursor-pointer"
                    >
                      <input
                        id="dir-ids"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          handleArrayFileUpload(e.target.files, "directorIds")
                        }
                      />
                      <span className="text-[9px] text-muted-foreground font-bold uppercase">
                        {companyDocs.directorIds.length > 0
                          ? `${companyDocs.directorIds.length} Added`
                          : "Add IDs"}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                      Residence *
                    </label>
                    <div
                      onClick={() =>
                        (document.getElementById("res-ids") as any).click()
                      }
                      className="border border-dashed border-border rounded-xl p-2 bg-muted/30 text-center cursor-pointer"
                    >
                      <input
                        id="res-ids"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          handleArrayFileUpload(
                            e.target.files,
                            "proofOfResidence",
                          )
                        }
                      />
                      <span className="text-[9px] text-muted-foreground font-bold uppercase">
                        {companyDocs.proofOfResidence.length > 0
                          ? `${companyDocs.proofOfResidence.length} Added`
                          : "Add Files"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-2 border-t border-border pt-3 mt-1">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFormErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="email@domain.com"
                  error={formErrors.email}
                />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Min 8 chars"
                    showPasswordToggle
                    error={formErrors.password}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder="Confirm"
                    showPasswordToggle
                    error={formErrors.confirmPassword}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSubmitDetails}
                className="w-full font-bold h-10 text-sm"
                isLoading={isLoading}
              >
                Submit and Verify
              </Button>
            </div>
          </div>
        )}

        {currentStep === "otp" && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-300 py-4">
            <button
              onClick={() => setCurrentStep("details")}
              className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-all uppercase mb-6"
            >
              <Icons.ArrowLeft size={14} /> Back to Details
            </button>
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icons.Mail size={20} className="text-accent" />
            </div>
            <h3 className="text-foreground font-bold italic text-base">
              Verify Email
            </h3>
            <p className="text-[10px] text-muted-foreground mb-8 italic">
              Check your inbox for the code sent to {email}
            </p>

            <div className="flex gap-2 justify-center mb-10">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  maxLength={1}
                  value={otp[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      const n = otp.split("");
                      n[i] = val;
                      setOtp(n.join(""));
                      if (val && (e.target.nextSibling as any))
                        (e.target.nextSibling as any).focus();
                    }
                  }}
                  className="w-10 h-12 bg-muted/50 border border-input rounded-xl text-center text-accent font-bold text-lg focus:border-accent outline-none"
                />
              ))}
            </div>

            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary text-primary-foreground font-bold h-10 text-sm"
            >
              Finish Registration
            </Button>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 text-center border-t border-border">
        <p className="text-[9px] text-muted uppercase tracking-[0.3em] font-medium">
          TESE Advertising Portal • 2026
        </p>
      </div>
    </div>
  );
};

export default RegisterDetailsPage;
