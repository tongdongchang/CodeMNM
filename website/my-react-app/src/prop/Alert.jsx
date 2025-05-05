import { useState, useEffect } from "react";

function Alert({ error, type="danger",id}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [id]);

  if (!error || !visible) return null;

  return (
    <div className={`alert ${type} fade show`} role="alert">
      <strong>{error}</strong>
    </div>
  );
}

export default Alert;