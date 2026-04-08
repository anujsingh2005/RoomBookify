export default function RoomBookifyLogo({ width = 300, height = 70, className = '' }) {
  return (
    <img
      src="/roombookify-logo.png"
      alt="RoomBookify"
      width={width}
      height={height}
      className={className}
      style={{
        width,
        height,
        objectFit: 'contain',
      }}
      loading="eager"
      decoding="async"
    />
  );
}
