# A Little Love Note

A responsive, seven-screen date invitation made with React, Vite, Tailwind CSS, Framer Motion, Lucide, and React Icons. The playful agreement is fictional and never collects payment.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; check code with `npm run lint`.

## Customize

Update `src/data/invitationConfig.js` to change the invitation image, footer note, agreement amount, and available time options. Replace `public/images/puppy.jpg` to use another local puppy photo; update `dogImageAlt` with an accurate description.

The selected date and time stay in React state for the whole flow. The final screen can copy those details to the clipboard and restart the experience.

The bundled pug photo is from Unsplash (`photo-1518020382113-a7e8fc38eac9`).
