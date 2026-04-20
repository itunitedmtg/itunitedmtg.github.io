const form = document.getElementById("ticketForm");
const successMsg = document.getElementById("successMsg");

const ZAPIER_WEBHOOK =
  "https://hooks.zapier.com/hooks/catch/21801912/uwcfvo6/";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: form.elements["name"].value,
    email: form.elements["email"].value,
    department: form.elements["department"].value,
    message: form.elements["message"].value,
    source: "United Mortgage Website",
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  // VERIFICACIÓN VISUAL (MUY IMPORTANTE)
  console.log("Payload enviado:", payload);

  const formData = new URLSearchParams(payload);

  try {
    await fetch(ZAPIER_WEBHOOK, {
      method: "POST",
      body: formData
    });

    successMsg.style.color = "#22c55e";
    successMsg.innerText = "✅ Ticket submitted successfully";
    form.reset();

  } catch (error) {
    console.error(error);
    successMsg.style.color = "#ef4444";
    successMsg.innerText = "❌ Error submitting ticket";
  }
});
