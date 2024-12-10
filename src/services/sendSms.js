const TEST = "0"; // Leave this as one for testing and set it to 0 for prod

export async function SendMessage({ number, messageToSend }) {
  try {
    // Generate a new OTP
    const message = encodeURIComponent(`${messageToSend}`);

    // Send OTP through external service
    const params = new URLSearchParams();
    params.append("username", import.meta.env.VITE_NAME);
    params.append("hash", import.meta.env.VITE_HASH);
    params.append("message", message);
    params.append("sender", "Correspondence");
    params.append("numbers", number);
    params.append("test", TEST);

    const response = await fetch("https://api.txtlocal.com/send/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.status !== "success") {
      return { success: false, data: "Failed to send message." };
    }

    return { success: true, data: "Message Sent!" };
  } catch (error) {
    console.log(error);
    return { success: false, data: "Unexpected server error." };
  }
}
