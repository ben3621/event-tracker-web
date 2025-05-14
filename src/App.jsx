import { useEffect, useState } from "react";

export default function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    type: "",
    location: "",
    notes: "",
    rating: 0
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log("✅ Event Tracker App loaded");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (rating) => {
    setForm({ ...form, rating });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const addEvent = () => {
    if (form.title && form.date && form.type) {
      setEvents([...events, form]);
      setForm({ title: "", date: "", type: "", location: "", notes: "", rating: 0 });
    }
  };

  const exportToCSV = () => {
    const csvRows = [
      ["Title", "Date", "Type", "Location", "Notes", "Rating"],
      ...events.map(event => [event.title, event.date, event.type, event.location, event.notes, event.rating])
    ];
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(filter.toLowerCase()) ||
    event.type.toLowerCase().includes(filter.toLowerCase()) ||
    event.location.toLowerCase().includes(filter.toLowerCase())
  );

  const totalEvents = events.length;
  const eventTypesCount = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎭 Event Attendance Tracker</h1>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} /><br />
      <input name="date" type="date" value={form.date} onChange={handleChange} /><br />
      <input name="type" placeholder="Type (e.g., Theater, Opera)" value={form.type} onChange={handleChange} /><br />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} /><br />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} /><br />
      <div>
        Rating:
        {[1, 2, 3, 4, 5].map((r) => (
          <span key={r} onClick={() => handleRating(r)} style={{ cursor: 'pointer', color: form.rating >= r ? 'gold' : 'gray' }}>
            ★
          </span>
        ))}
      </div>
      <button onClick={addEvent}>Add Event</button>
      <hr />
      <input placeholder="Filter events..." value={filter} onChange={handleFilterChange} /><br />
      <button onClick={exportToCSV}>Export CSV</button>
      <h2>Events</h2>
      <ul>
        {filteredEvents.map((event, index) => (
          <li key={index}>
            <strong>{event.title}</strong> ({event.date}) - {event.type} at {event.location} | Rating: {event.rating}/5
            <br />Notes: {event.notes}
          </li>
        ))}
      </ul>
      <h3>Statistics</h3>
      <p>Total Events: {totalEvents}</p>
      <ul>
        {Object.entries(eventTypesCount).map(([type, count]) => (
          <li key={type}>{type}: {count}</li>
        ))}
      </ul>
    </div>
  );
}
