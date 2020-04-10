import React from "react"
import '../styles/contact.css';

export default () => (
  <div class="form-container">
    <h2 style={{ color: '#006D5B' }}>Do you have something in mind? Contact me!</h2>
    <div>
      <form method="post" netlify-honeypot="bot-field" data-netlify="true">
        <input type="hidden" name="bot-field" />
        <label>
          Your Email
          <input type="email" name="email" />
        </label>
        <label>
          Your Name
          <input type="text" name="name" />
        </label>
        <label>
          Message
          <input type="text" name="message" />
        </label>
        <button type="submit">Contact me!</button>
      </form>
    </div>
  </div>
)