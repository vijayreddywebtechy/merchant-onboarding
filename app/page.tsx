"use client";

import styles from "./page.module.css";
import { Suspense } from "react";
import AuthCallback from "@/components/application/authCallBack";

function PageContent() {
  return (
    <div className={styles.page}>
      Welcome
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageWithCallback />
    </Suspense>
  );
}

function PageWithCallback() {
  // This will handle the case where PING redirects to root
  return (
    <div>
      <AuthCallback />
      <PageContent />
    </div>
  );
}
