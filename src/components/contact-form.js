import React from 'react';
import './contact-form.module.css';

export default () => (
  <form method="post" name="contact" netlify-honeypot="bot-field" data-netlify="true">
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
);