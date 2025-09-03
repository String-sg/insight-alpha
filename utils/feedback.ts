/**
 * Utility functions for feedback functionality
 */

/**
 * Generates a feedback form URL with optional user email pre-filled
 * @param userEmail - Optional user email to pre-fill in the form
 * @returns URL to the Singapore government feedback form
 */
export const getFeedbackFormUrl = (userEmail?: string): string => {
  const baseUrl = 'https://form.gov.sg/68b7d5099b55d364153be0d5';
  
  if (userEmail) {
    return `${baseUrl}?68b7d5e965cd36be28735915=${encodeURIComponent(userEmail)}`;
  }
  
  return baseUrl;
};
