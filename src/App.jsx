import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Card, CardContent } from "./components/ui/card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function App() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", type: "", location: "", notes: "", rating: 0, tags: "" });
  const [calendarDate, setCalendarDate] = useState(new Date());

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addEvent = (e) => {
    e.preventDefault();
    if (form.title && form.date && form.type) {
      setEvents([...events, form]);
      setForm({ title: "", date: "", type: "", location: "", notes: "", rating: 0, tags: "" });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 text-black dark:text-white">
      <Card>
        <CardContent>
          <h1 className="text-xl font-bold">Welcome, {user.email}</h1>
          <Calendar value={calendarDate} onChange={setCalendarDate} />
        </CardContent>
      </Card>
      <form onSubmit={addEvent} className="space-y-4 mt-4">
        <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <Input name="date" type="date" value={form.date} onChange={handleChange} />
        <Input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
        <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <Textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        <Input name="tags" placeholder="Tags" value={form.tags} onChange={handleChange} />
        <Button type="submit">Add Event</Button>
      </form>
    </div>
  );
}