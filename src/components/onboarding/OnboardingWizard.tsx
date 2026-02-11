"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/utils";

interface OnboardingWiUSDdProps {
  onComplete: () => void;
}

const OnboardingWiUSDd: React.FC<OnboardingWiUSDdProps> = ({ onComplete }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Business Profile
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Address
  const [address, setAddress] = useState("");

  // Step 3: Verification
  const [documents, setDocuments] = useState<{
    registration?: File;
    directorId?: File;
  }>({});

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {step === 1 && "Business Profile"}
              {step === 2 && "Address Details"}
              {step === 3 && "Verification Documents"}
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Business Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Icons.Users size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Welcome! Let's set up your profile
              </h2>
              <p className="text-muted-foreground mt-2">
                Tell us about your business to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
              />
              <Input
                label="Contact Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Enter contact name"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Address Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Icons.Wallet size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Where are you located?
              </h2>
              <p className="text-muted-foreground mt-2">
                This helps us customize your experience
              </p>
            </div>

            <Input
              label="Business Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full business address"
              required
            />

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icons.AlertCircle size={20} className="text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-500">
                    Your wallet will be created automatically
                  </p>
                  <p className="text-sm text-blue-500/80 mt-1">
                    You'll receive a $ wallet for all
                    transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Verification Documents */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Icons.Upload size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Verify your business
              </h2>
              <p className="text-muted-foreground mt-2">
                Upload required documents for KYC verification
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Icons.Upload
                  size={24}
                  className="mx-auto text-muted-foreground mb-2"
                />
                <p className="text-sm font-medium text-foreground">
                  Company Registration
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, or PNG up to 5MB
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    setDocuments((prev) => ({
                      ...prev,
                      registration: e.target.files?.[0],
                    }))
                  }
                />
                <Button variant="ghost" size="sm" className="mt-3">
                  Select File
                </Button>
                {documents.registration && (
                  <p className="text-xs text-green-500 mt-2">
                    ✓ {documents.registration.name}
                  </p>
                )}
              </div>

              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Icons.Upload
                  size={24}
                  className="mx-auto text-muted-foreground mb-2"
                />
                <p className="text-sm font-medium text-foreground">
                  Director ID Document
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, or PNG up to 5MB
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    setDocuments((prev) => ({
                      ...prev,
                      directorId: e.target.files?.[0],
                    }))
                  }
                />
                <Button variant="ghost" size="sm" className="mt-3">
                  Select File
                </Button>
                {documents.directorId && (
                  <p className="text-xs text-green-500 mt-2">
                    ✓ {documents.directorId.name}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icons.AlertCircle size={20} className="text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent">
                    Verification typically takes 1-2 business days
                  </p>
                  <p className="text-sm text-accent/80 mt-1">
                    You can still create campaigns while your documents are
                    being reviewed
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            leftIcon={<Icons.ChevronLeft size={16} />}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            isLoading={isLoading}
            rightIcon={
              step === totalSteps ? undefined : <Icons.ChevronRight size={16} />
            }
          >
            {step === totalSteps ? "Complete Setup" : "Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingWiUSDd;
