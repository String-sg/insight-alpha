/**
 * Helper function to generate feedback form URL with optional email prefill
 * @param email - Optional user email to prefill the form
 * @returns The feedback form URL with email parameter if provided
 */
export function getFeedbackFormUrl(email?: string): string {
  const baseUrl = 'https://form.gov.sg/68b7d5099b55d364153be0d5';
  if (email) {
    return `${baseUrl}?68b7d5e965cd36be28735915=${encodeURIComponent(email)}`;
  }
  return baseUrl;
}
