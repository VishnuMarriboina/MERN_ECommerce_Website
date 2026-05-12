// Function to extract last 10 digits
export default function extractPhone(value) {
  if (!value) return "";

  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, "");

  // Always return last 10 digits
  return cleaned.slice(-10);
}
