"use client";

import { useEffect, useState } from "react";

type PermissionState = "default" | "granted" | "denied" | "unsupported";

const STORAGE_KEY = "matchflow.push_notifications_opted_in";

export function PushNotificationPrompt({ tournamentTitle }: Readonly<{ tournamentTitle: string }>) {
  const [permState, setPermState] = useState<PermissionState>("default");
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      setPermState("unsupported");
      return;
    }

    const current = Notification.permission as PermissionState;
    setPermState(current);

    // Don't re-show if already opted in
    const storedOptIn = localStorage.getItem(STORAGE_KEY);
    if (storedOptIn === "true" || current === "granted") {
      setIsDismissed(true);
    }
  }, []);

  async function handleRequestPermission() {
    if (!("Notification" in window)) return;

    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermState(result as PermissionState);

      if (result === "granted") {
        // Stub: save opt-in to localStorage (real backend subscription in Phase 8+)
        localStorage.setItem(STORAGE_KEY, "true");
        // Stub: show a confirmation notification
        new Notification("MatchFlow Arena", {
          body: `You'll be notified about updates for ${tournamentTitle}.`,
          icon: "/icon-192.png"
        });
        setIsDismissed(true);
      }
    } catch {
      // Permission request failed (e.g., secure context requirement)
    } finally {
      setIsLoading(false);
    }
  }

  // Don't show if: dismissed, already granted/denied, or unsupported
  if (isDismissed || permState === "denied" || permState === "unsupported" || permState === "granted") {
    return null;
  }

  return (
    <div className="push-prompt" role="complementary" aria-label="Notification opt-in" id="push-notification-prompt">
      <div className="push-prompt-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
      <div className="push-prompt-content">
        <p className="push-prompt-title">Stay in the loop</p>
        <p className="push-prompt-desc">
          Get notified when registration opens or brackets are published for this tournament.
        </p>
      </div>
      <div className="push-prompt-actions">
        <button
          className="push-prompt-cta"
          onClick={handleRequestPermission}
          disabled={isLoading}
          type="button"
          id="push-enable-btn"
        >
          {isLoading ? "Enabling…" : "Enable alerts"}
        </button>
        <button
          className="push-prompt-dismiss"
          onClick={() => setIsDismissed(true)}
          type="button"
          aria-label="Dismiss notification prompt"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
