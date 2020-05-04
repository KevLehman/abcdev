import React from "react"
import { Helmet } from "react-helmet"
import ContactForm from '../components/contact-form';

export default () => (
  <div class="flex justify-center flex-col h-full w-3/5 max-w-screen-lg m-auto">
    <Helmet title="ABCDev - Contact" />
    <h2 class="text-teal-600">Do you have something in mind? Contact me!</h2>
      <ContactForm />
  </div>
)