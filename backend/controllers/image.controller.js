import dotenv from "dotenv";
dotenv.config();
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
});

export const authenticateUser = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  return res.send(result);
};
