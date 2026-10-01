export default function Logo({ tamano = 40 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M14 2h12v12h12v12H26v12H14V26H2V14h12z" fill="#fff" />
      <path d="M20 27s-6-3.7-6-8a3.2 3.2 0 0 1 6-1.6 3.2 3.2 0 0 1 6 1.6c0 4.3-6 8-6 8z" fill="#1D63D8" />
    </svg>
  );
}
