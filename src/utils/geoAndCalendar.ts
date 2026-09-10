import { Institution, QuranicEvent, StudyScheduleItem } from '../types';

/**
 * Calculates distance in kilometers between two latitude/longitude points (Haversine formula)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Generates direct navigation direction link
 */
export function getDirectionsUrl(lat: number, lng: number, userLat?: number, userLng?: number): string {
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Generates an .ics calendar file and triggers a browser download
 */
export function exportToIcs(event: QuranicEvent | { title: string; description: string; location: string; startDate: string; time: string }) {
  const cleanTitle = event.title.replace(/\n/g, ' ');
  const cleanDesc = event.description.replace(/\n/g, ' ');
  const cleanLoc = ('locationDetails' in event ? event.locationDetails : event.location).replace(/\n/g, ' ');
  
  // Format date: YYYYMMDDTHHmm00Z
  const dateParts = event.startDate.split('-');
  const y = dateParts[0] || '2026';
  const m = (dateParts[1] || '09').padStart(2, '0');
  const d = (dateParts[2] || '01').padStart(2, '0');
  const startStamp = `${y}${m}${d}T090000Z`;
  const endStamp = `${y}${m}${d}T120000Z`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Manarat Al-Jazair//Quranic Events//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:manarat-${Date.now()}@algeria-quran.dz`,
    `DTSTAMP:${startStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `LOCATION:${cleanLoc}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `event-${event.title.substring(0, 15).replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a Google Calendar Web URL for one-click adding
 */
export function getGoogleCalendarUrl(event: QuranicEvent): string {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(`${event.description}\n\nالمؤسسة: ${event.institutionName}\nالولاية: ${event.wilaya}`);
  const location = encodeURIComponent(event.locationDetails);
  
  const dateClean = event.startDate.replace(/-/g, '');
  const dates = `${dateClean}T090000Z/${dateClean}T120000Z`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}
