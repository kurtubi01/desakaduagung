"use client";

import { useEffect, useState, ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

const MINIMUM_LOADING_TIME = 2200;
const EXIT_ANIMATION_TIME = 700;

interface OpeningExperienceProps {
  children: ReactNode;
}

export default function OpeningExperience({ children }: OpeningExperienceProps) {
  const [opening, setOpening] = useState<boolean>(false);
  const [exiting, setExiting] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenOpening = window.sessionStorage.getItem("kadu-agung-opening-seen");

    if (hasSeenOpening) {
      const showContent = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(showContent);
    }

    const showOpening = window.setTimeout(() => setOpening(true), 0);
    document.body.classList.add("opening-is-active");
    const startedAt = Date.now();
    let pageLoaded = document.readyState === "complete";

    const finishWhenReady = () => {
      pageLoaded = true;
      const remaining = Math.max(0, MINIMUM_LOADING_TIME - (Date.now() - startedAt));
      window.setTimeout(() => {
        setExiting(true);
        window.setTimeout(() => {
          window.sessionStorage.setItem("kadu-agung-opening-seen", "true");
          document.body.classList.remove("opening-is-active");
          setOpening(false);
          setReady(true);
        }, EXIT_ANIMATION_TIME);
      }, remaining);
    };

    if (pageLoaded) finishWhenReady();
    else window.addEventListener("load", finishWhenReady, { once: true });

    return () => {
      window.clearTimeout(showOpening);
      window.removeEventListener("load", finishWhenReady);
      document.body.classList.remove("opening-is-active");
    };
  }, []);

  return (
    <>
      <div className={`opening-content ${ready ? "opening-content--ready" : ""}`}>
        {children}
      </div>
      {opening ? <LoadingScreen exiting={exiting} /> : null}
    </>
  );
}