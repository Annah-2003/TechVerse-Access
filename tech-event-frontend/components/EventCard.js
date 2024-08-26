import Link from 'next/link';

const EventCard = ({ event }) => {
  return (
    <div className="border rounded-lg p-4 shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
      <p className="text-gray-600 mb-4">{event.date}</p>
      <p className="mb-4">{event.description}</p>
      <Link href={`/events/${event.id}`}>
        <a className="text-blue-500 hover:underline">View Details</a>
      </Link>
    </div>
  );
};

export default EventCard;
