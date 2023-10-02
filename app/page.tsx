'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api', {
        body: JSON.stringify({ itemId: 5 }),
        method: 'POST',
      });
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading && <span>Loading...</span>}
      {data && <span>{JSON.stringify(data)}</span>}
    </div>
  );
}
