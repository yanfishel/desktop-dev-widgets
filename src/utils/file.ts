import base32Encode from "base32-encode";

import {documentIcon} from "../assets";
import {IMAGES_MIME} from "../constants";


export const fileToBase64 = async (file:File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result); // This will be the Base64 data URL
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

export const filetoBase32 = async (file:File) => {
  try {
    const uint8Array = await readFileAsUint8Array(file);
    const base32Encoded = base32Encode(uint8Array as Uint8Array, 'RFC4648'); // Or 'Crockford', 'RFC4648-HEX'
    return base32Encoded;
  } catch (error) {
    console.error("Error converting file to Base32:", error);
  }
}

export const readFileAsUint8Array = async (file:File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export const fileFromBase64 = (base64String:string) => {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new File([bytes], 'decoded-file.txt', { type: 'text/plain' });
}

export const isBase64 = (value:string) => {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(value);
}

export const htmlFilePreview = (file:File|string) => {
  if(typeof file !== 'string' && 'type' in file) {
    if(!IMAGES_MIME.includes(file.type)) {
      const wrap = document.createElement('span')
      wrap.innerHTML = documentIcon
      return wrap
    }
  }
  const image = new Image();
  image.src = typeof file === 'string' ? file : URL.createObjectURL(file)
  image.onload = function() {
    URL.revokeObjectURL(image.src);
  }
  image.onerror = function(error) {
    console.error('Error loading image:', error);
  }
  return image
}