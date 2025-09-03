export const getFeedbackFormUrl = (userEmail?: string): string => {
  const baseUrl = 'https://form.gov.sg/68b7d5099b55d364153be0d5';
  
  if (userEmail) {
    return `${baseUrl}?68b7d5e965cd36be28735915=${encodeURIComponent(userEmail)}`;
  }
  
  return baseUrl;
};
