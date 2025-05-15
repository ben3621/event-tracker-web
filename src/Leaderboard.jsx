import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const data = snapshot.docs.map(doc => doc.data());

      const grouped = {};
      data.forEach(event => {
        if (!grouped[event.uid]) {
          grouped[event.uid] = { email: event.userEmail || "Unknown", uid: event.uid, count: 0 };
        }
        grouped[event.uid].count += 1;
      });

      const sorted = Object.values(grouped).sort((a, b) => b.count - a.count);
      setUserStats(sorted);
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul className="divide-y">
        {userStats.map(user => (
          <li key={user.uid} className="py-2 flex justify-between">
            <Link to={`/stats/${user.uid}`} className="text-blue-600 hover:underline">
              {user.email}
            </Link>
            <span>{user.count} events</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
