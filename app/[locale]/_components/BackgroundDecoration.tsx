/**
 * Background decoration with floral corners and grain texture
 * Pure presentational component
 */
export function BackgroundDecoration() {
  return (
    <>
      {/* Decorative background elements */}
      <div className="bg-decoration">
        <div className="floral-corner top-left"></div>
        <div className="floral-corner top-right"></div>
        <div className="floral-corner bottom-left"></div>
        <div className="floral-corner bottom-right"></div>
      </div>
      
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true"></div>
    </>
  );
}
