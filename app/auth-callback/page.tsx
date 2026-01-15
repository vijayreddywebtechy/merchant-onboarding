"use client";

import AuthCallback from "@/components/application/authCallBack";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
};

export default page;
