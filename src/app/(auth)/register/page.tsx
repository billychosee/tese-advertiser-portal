"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to details page where user can select account type
    router.replace("/register/details");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
};

export default RegisterPage;
