import localFont from "next/font/local";
// Benton Sans Pro font
export const bentonSansPro = localFont({
  src: [
    {
      path: '../assets/fonts/BentonSansProRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BentonSansProMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BentonSansProBold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-bspro',
  display: 'swap',
})