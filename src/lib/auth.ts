export const ADMIN_PASSWORD =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_PASSWORD
    ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    : "Nct0103@";
