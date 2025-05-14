import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import AuthUI from "./AuthUI";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function App() {
  const { user } = useAuth();

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("eventTrackerEvents");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "",
    location: "",
    notes: "",
    rating: 0,
    tags: ""
  });

  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortAsc, setSortAsc] = useState(true);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("eventTrackerEvents", JSON.stringify(events));
  }, [events]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (rating) => {
    setForm({ ...form, rating });
  };

  const addEvent = () => {
    if (form.title && form.date && form.type) {
      setEvents([...events, form]);
      setForm({ title: "", date: new Date().toISOString().split("T")[0], type: "", location: "", notes: "", rating: 0, tags: "" });
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const exportToCSV = () => {
    const csvRows = [
      ["Title", "Date", "Type", "Location", "Notes", "Rating", "Tags"],
      ...events.map(event => [event.title, event.date, event.type, event.location, event.notes, event.rating, event.tags])
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

  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(filter.toLowerCase()) ||
      event.type.toLowerCase().includes(filter.toLowerCase()) ||
      event.location.toLowerCase().includes(filter.toLowerCase()) ||
      event.tags.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

  const calendarEvents = events.filter(event => event.date === calendarDate.toISOString().split("T")[0]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const d = date.toISOString().split('T')[0];
      const match = events.find(e => e.date === d);
      if (match) {
        return `bg-opacity-50 rounded-full ${match.type === 'Theater' ? 'bg-red-200' : match.type === 'Opera' ? 'bg-blue-200' : 'bg-green-200'}`;
      }
    }
    return null;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans">
      <AuthUI />
      <h1 className="text-3xl font-bold mb-4">🎭 <span className="text-red-600">Event Attendance Tracker</span></h1>
      {user ? (
        <>
          <div className="space-y-2 mb-4">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border px-2 py-1 w-full" />
            <input name="date" type="date" value={form.date} onChange={handleChange} className="border px-2 py-1 w-full" />
            <input name="type" placeholder="Type (e.g., Theater, Opera)" value={form.type} onChange={handleChange} className="border px-2 py-1 w-full" />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border px-2 py-1 w-full" />
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="border px-2 py-1 w-full" />
            <input name="tags" placeholder="Tags (e.g., classical, family)" value={form.tags} onChange={handleChange} className="border px-2 py-1 w-full" />
            <div>Rating:
              {[1,2,3,4,5].map(r => (
                <span key={r} onClick={() => handleRating(r)} style={{ cursor: "pointer", color: form.rating >= r ? "gold" : "gray" }}>★</span>
              ))}
            </div>
            <button onClick={addEvent} className="bg-red-500 text-white px-4 py-1 rounded">Add Event</button>
          </div>
          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[0, 1, 2].map(offset => {
              const now = new Date();
              const firstOfMonth = new Date(now.getFullYear(), now.getMonth() - offset, 1);
              return (
                <div key={offset} className="text-sm">
                  <h3 className="text-lg font-semibold text-slate-700 mb-2 text-center">
                    {firstOfMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                  </h3>
                  <Calendar
                    value={firstOfMonth}
                    onClickDay={setCalendarDate}
                    tileClassName={tileClassName}
                    maxDetail="month"
                    showNeighboringMonth={true}
                    className="border rounded-md"
                  />
                </div>
              );
            })}
          </div>
          <h2 className="text-xl font-semibold mb-2">Events on {calendarDate.toISOString().split("T")[0]}</h2>
          {calendarEvents.length > 0 ? (
            <ul className="list-disc pl-6 mb-4">
              {calendarEvents.map((event, i) => (
                <li key={i}>{event.title} – {event.type} @ {event.location}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 mb-4">No events on this day.</p>
          )}
          <div className="flex justify-between items-center mb-2">
            <input placeholder="Filter events..." value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-2 py-1 w-full max-w-sm" />
            <button onClick={exportToCSV} className="ml-4 border px-4 py-1 rounded">Export CSV</button>
          </div>
          <table className="w-full border text-left table-auto">
            <thead className="sticky top-0 bg-white border-b">
              <tr>
                {["Title", "Date", "Type", "Location", "Notes", "Rating", "Tags"].map(key => (
                  <th key={key} className="cursor-pointer px-2 py-1 text-sm font-medium" onClick={() => handleSort(key.toLowerCase())}>
                    {key} {sortKey === key.toLowerCase() ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="px-2 py-1">{event.title}</td>
                  <td className="px-2 py-1">{event.date}</td>
                  <td className="px-2 py-1">{event.type}</td>
                  <td className="px-2 py-1">{event.location}</td>
                  <td className="px-2 py-1">{event.notes}</td>
                  <td className="px-2 py-1">{event.rating}/5</td>
                  <td className="px-2 py-1">{event.tags}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm">Total Events: {events.length}</p>
        </>
      ) : (
        <p className="text-gray-500 mt-8">Please log in to use the tracker.</p>
      )}
    </div>
  );
}
