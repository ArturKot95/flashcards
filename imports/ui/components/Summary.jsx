import React from 'react';
import './Summary.css';

export default function Summary({ summary, style }) {
  return <div style={style} className='collectionsummary'>
    <span>Due: {summary.due}</span>
    <span>Later: {summary.later}</span>
    <span>Learning: {summary.learning}</span>
    <span>Overdue: {summary.overdue}</span>
  </div>
}