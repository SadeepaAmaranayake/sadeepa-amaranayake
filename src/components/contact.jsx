import React, { useState } from "react";

function Contact() {
  const [result, setResult] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setResult("Sending...");

    const formData = new FormData(event.target);

    formData.append(
      "access_key",
      process.env.REACT_APP_WEB3FORMS_ACCESS_KEY
    );
    
    const response = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      setResult("Message sent successfully!");
      event.target.reset();
    } else {
      setResult("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact">
      <h2>Contact Me</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          required
        />

        <button type="submit">
          Send Message
        </button>

        <p>{result}</p>
      </form>
    </section>
  );
}

export default Contact;