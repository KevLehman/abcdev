import React from "react"
import { Helmet } from "react-helmet"
import ContactForm from '../components/contact-form';
import '../styles/contact.css';

export default () => (
  <div class="form-container">
    <Helmet title="ABCDev - Contact" />
    <h2 style={{ color: '#006D5B' }}>Do you have something in mind? Contact me!</h2>
      <ContactForm />
  </div>
)