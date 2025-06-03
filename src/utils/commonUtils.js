
export function generateUniqueId() {
    const timestamp = new Date().getTime(); // Get current timestamp
    const randomNum = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
    const uniqueId = `${timestamp}${randomNum}`;
  
    return uniqueId;
  }
  