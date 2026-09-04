import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TICKETS } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await context.params;
  const ticket = MOCK_TICKETS.find(t => t.id === ticketId) || MOCK_TICKETS[0];

  const movie = ticket.show?.movie;
  const cinema = ticket.show?.cinema;
  const seat = ticket.seat;
  const startTime = ticket.show?.start_time ? new Date(ticket.show.start_time).toISOString() : new Date().toISOString();

  // Construct Apple PassKit pass.json payload
  const passPayload = {
    formatVersion: 1,
    passTypeIdentifier: 'pass.io.movei.cinema',
    serialNumber: ticket.ticket_code,
    teamIdentifier: 'MOVEI_APPLE_DEV',
    organizationName: 'MOVEI Cinema Network',
    description: `${movie?.title || 'Cinema Ticket'} Pass`,
    foregroundColor: 'rgb(243, 244, 246)',
    backgroundColor: 'rgb(20, 23, 28)',
    labelColor: 'rgb(186, 232, 97)',
    eventTicket: {
      primaryFields: [
        {
          key: 'film',
          label: 'MOVIE',
          value: movie?.title || 'Cinema Pass'
        }
      ],
      secondaryFields: [
        {
          key: 'cinema',
          label: 'CINEMA',
          value: cinema?.name || 'Colombo City Centre'
        },
        {
          key: 'hall',
          label: 'HALL',
          value: ticket.show?.screen?.name || 'Screen 1'
        }
      ],
      auxiliaryFields: [
        {
          key: 'seat',
          label: 'SEAT',
          value: seat ? `${seat.row_label}${seat.seat_number}` : 'F5'
        },
        {
          key: 'showtime',
          label: 'TIME',
          value: startTime,
          dateStyle: 'PKDateStyleShort',
          timeStyle: 'PKDateStyleShort'
        }
      ],
      backFields: [
        {
          key: 'policy',
          label: 'ADMISSION POLICY',
          value: 'Admission is subject to gate scanner validation. Please present this pass upon entry.'
        },
        {
          key: 'booking_ref',
          label: 'BOOKING REF',
          value: ticket.booking_id
        }
      ]
    },
    barcode: {
      message: ticket.barcode_value,
      format: 'PKBarcodeFormatCode128',
      messageEncoding: 'iso-8859-1'
    },
    barcodes: [
      {
        message: ticket.barcode_value,
        format: 'PKBarcodeFormatCode128',
        messageEncoding: 'iso-8859-1'
      },
      {
        message: ticket.barcode_value,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      }
    ],
    locations: cinema?.latitude ? [
      {
        latitude: cinema.latitude,
        longitude: cinema.longitude,
        relevantText: `You are near ${cinema.name}. Present this pass for entry.`
      }
    ] : []
  };

  // Return formatted PassKit json with appropriate content disposition
  const jsonString = JSON.stringify(passPayload, null, 2);

  return new NextResponse(jsonString, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="${ticket.ticket_code}.pkpass"`,
      'Cache-Control': 'no-store'
    }
  });
}
