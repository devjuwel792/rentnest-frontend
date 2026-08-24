"use client";

import { useState } from "react";
import { createReview } from "@/lib/api";

type ReviewStatus = "idle" | "submitting" | "success" | "error";

export default function WriteReviewModal({
  propertyId,
  propertyTitle,
  onClose,
  onSuccess,
}: {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<ReviewStatus>("idle");
  const [message, setMessage] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const canSubmit = status !== "submitting" && rating > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!propertyId || rating === 0) return;

    setStatus("submitting");
    setMessage("");
    try {
      await createReview({
        propertyId,
        rating,
        comment: comment.trim(),
      });
      setStatus("success");
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Could not submit review."
      );
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Write a review"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Write a Review
            </h2>
            <p className="mt-1 line-clamp-1 text-sm text-gray-500">
              {propertyTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {status === "success" ? (
          <div className="mt-6 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-3 font-semibold text-gray-900">
              Review submitted!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Thanks for sharing your feedback.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your rating
              </label>
              <div
                className="mt-2 flex gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    className={`text-2xl transition-colors ${
                      value <= displayRating
                        ? "text-amber-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  Please select a rating.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reviewComment"
                className="block text-sm font-medium text-gray-700"
              >
                Comment
              </label>
              <textarea
                id="reviewComment"
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience staying at this property..."
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {status === "error" && message && (
              <div
                role="alert"
                className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
              >
                <p className="flex items-center gap-1.5 font-semibold">
                  <span>⚠️</span> {message}
                </p>
                {message.toLowerCase().includes("already reviewed") && (
                  <p className="mt-1 text-xs text-amber-700">
                    You have already submitted feedback for this property. Only one review per property is allowed.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
