import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToReadableString(isoDateString: any) {
  const date = new Date(isoDateString);

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options as any);
}

export function generatePassword(
  length = 8,
  includeUppercase = true,
  includeLowercase = true,
  includeDigits = true,
  includeSpecial = true
) {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const digitChars = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let characters = "";
  if (includeUppercase) {
    characters += uppercaseChars;
  }
  if (includeLowercase) {
    characters += lowercaseChars;
  }
  if (includeDigits) {
    characters += digitChars;
  }
  if (includeSpecial) {
    characters += specialChars;
  }

  if (characters.length === 0) {
    throw new Error("At least one character type must be included.");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return password;
}

