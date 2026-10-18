"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import "./matte-alert-feedback.css";

export interface MatteAlertFeedbackProps {
  /** Heading of the surrounding card. */
  cardTitle?: string;
  /** Supporting copy under the card heading. */
  cardDescription?: string;
  /** Small pill badge shown next to the card heading. */
  pillText?: string;
  /** Alias for pillText. */
  pill?: string;
  /** Title of the inline alert message. */
  alertTitle?: string;
  /** Alias for alertTitle. */
  title?: string;
  /** Detail copy of the inline alert message. */
  alertDetail?: string;
  /** Alias for alertDetail. */
  detail?: string;
  /** Label of the button that (re)shows the alert. */
  buttonLabel?: string;
  /** Caption shown under the demo controls. */
  caption?: string;
  /** Whether the alert is visible on mount. */
  defaultVisible?: boolean;
  /** Called after the alert is dismissed. */
  onDismiss?: () => void;
  /** Called after the alert is (re)shown. */
  onShow?: () => void;
  /** Dismiss button accessibility label (from t()). */
  dismissLabel?: string;
  /** Message announced in polite live region on dismissal (from t()). */
  dismissedMessage?: string;
  /** Semantic variant reflecting intent and styling. */
  variant?: "info" | "warning" | "critical" | "success";
  /** Bare mode removes surrounding card chrome for inline alerts. */
  bare?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A card containing a collapsible inline alert. A close button dismisses it,
 * and a Show Alert button brings it back. Visibility changes are announced
 * through a polite live region.
 */
export function MatteAlertFeedback({
  cardTitle,
  cardDescription,
  pillText,
  pill,
  alertTitle,
  title,
  alertDetail,
  detail,
  buttonLabel = "Show notification",
  caption,
  defaultVisible = true,
  onDismiss,
  onShow,
  dismissLabel = "Dismiss notification",
  dismissedMessage = "Message dismissed.",
  variant = "warning",
  bare = false,
  className,
  style,
}: MatteAlertFeedbackProps) {
  const resolvedPill = pillText || pill || "";
  const resolvedTitle = alertTitle || title || "Notice";
  const resolvedDetail = alertDetail || detail || "";
  const [visible, setVisible] = useState(defaultVisible);
  const [liveMessage, setLiveMessage] = useState("");
  const showButtonRef = useRef<HTMLButtonElement>(null);
  const collapseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collapseRef.current) {
      if (!visible) {
        collapseRef.current.setAttribute("inert", "");
      } else {
        collapseRef.current.removeAttribute("inert");
      }
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setLiveMessage(dismissedMessage);
    requestAnimationFrame(() => {
      showButtonRef.current?.focus({ preventScroll: true });
    });
    onDismiss?.();
  }, [dismissedMessage, onDismiss]);

  const handleShow = useCallback(() => {
    setVisible(true);
    setLiveMessage(resolvedTitle);
    onShow?.();
  }, [resolvedTitle, onShow]);

  const alertRole = variant === "critical" ? "alert" : "status";

  return (
    <div
      className={"fb-demo" + (className ? " " + className : "")}
      data-feedback="alert"
      data-bare={bare ? "true" : undefined}
      tabIndex={-1}
      style={style}
    >
      <div className="fb-scene">
        <div className="fb-card">
          {!bare && (cardTitle || resolvedPill || cardDescription) ? (
            <>
              <div className="fb-card-head">
                {cardTitle ? <h3>{cardTitle}</h3> : null}
                {resolvedPill ? <span className="fb-pill">{resolvedPill}</span> : null}
              </div>
              {cardDescription ? <p>{cardDescription}</p> : null}
            </>
          ) : null}
          <div
            ref={collapseRef}
            className="fb-collapse"
            data-panel
            data-visible={visible ? "true" : "false"}
            inert={!visible ? true : undefined}
          >
            <div>
              <div
                className="fb-alert"
                data-variant={variant}
                role={alertRole}
                aria-live={variant === "critical" ? "assertive" : "polite"}
              >
                {variant === "info" ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4m0-4h.01" />
                  </svg>
                ) : variant === "success" ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="m10.3 4.8-8 13.8A1.6 1.6 0 0 0 3.7 21h16.6a1.6 1.6 0 0 0 1.4-2.4l-8-13.8a2 2 0 0 0-3.4 0Z" />
                    <path d="M12 9v5m0 3h.01" />
                  </svg>
                )}
                <div className="fb-copy">
                  <h3 data-title>{resolvedTitle}</h3>
                  <p data-detail>{resolvedDetail}</p>
                </div>
                <button
                  className="fb-close"
                  type="button"
                  data-action="dismiss"
                  aria-label={dismissLabel}
                  tabIndex={visible ? 0 : -1}
                  onClick={handleDismiss}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="m6 6 12 12M6 18 18 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(!visible || !bare) && (
        <div className="fb-tools">
          <button
            type="button"
            className="fb-button"
            data-demo="show"
            ref={showButtonRef}
            onClick={handleShow}
          >
            {buttonLabel}
          </button>
        </div>
      )}
      {caption && <p className="fb-caption">{caption}</p>}
      <span
        className="fb-sr"
        data-live
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveMessage}
      </span>
      <span className="fb-sr" data-error role="alert" aria-atomic="true" />
    </div>
  );
}

export default MatteAlertFeedback;
