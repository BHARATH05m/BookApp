import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// reviews: array of { rating: number }
const RatingChart = ({ reviews }) => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (reviews || []).forEach(r => {
    const val = Number(r.rating) || 0;
    if (val >= 1 && val <= 5) counts[val] += 1;
  });
  const data = [1,2,3,4,5].map(star => ({ star: `${star}★`, count: counts[star] }));

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="star" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingChart;


