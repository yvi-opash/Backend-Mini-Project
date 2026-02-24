import crypto from "crypto";

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${token}`;
  
  console.log(`\n Email Verification Link for this ${email}:`);
  console.log(`${verificationUrl}\n`);
  

};
