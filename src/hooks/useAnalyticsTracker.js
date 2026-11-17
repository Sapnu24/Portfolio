import { useEffect } from "react";
import { recordPageView } from "@/services/analyticsServices";

export function useAnalyticsTracker() {
  useEffect(() => {
    // 1. Record initial page load
    recordPageView(window.location.hash || window.location.pathname || "/");

    // 2. Listen to hash changes (e.g. #projects, #career, #certifications, #contact)
    const handleHashChange = () => {
      recordPageView(window.location.hash || "/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
}
