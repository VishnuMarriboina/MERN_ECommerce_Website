import React, { useEffect, useState } from "react";

/* ---------- Types & Interfaces ---------- */

// Union type
type Status = "ACTIVE" | "INACTIVE";

// Interface for user object
interface User {
  id: number;
  name: string;
  age?: number; // optional
  status: Status;
}

/* ---------- Component ---------- */
const Ts: React.FC = () => {
  /* ---------- State ---------- */
  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<Status>("INACTIVE");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  type bob = "ON" | "OFF";
  const [abc, setAbc] = useState<bob>("ON");

  const toggleAbc = (): void => {
    console.log("line number 28", abc);
    setAbc((prev) => (prev === "ON" ? "OFF" : "ON"));

    console.log("line number 30", abc);
  };

  /* ---------- Functions ---------- */
  const increment = (): void => {
    setCount((prev) => prev + 1);
  };

  const toggleStatus = (): void => {
    setStatus((prev) => (prev === "ACTIVE" ? "INACTIVE" : "ACTIVE"));
  };

  const addUser = (name: string, age?: number): void => {
    const newUser: User = {
      id: Date.now(),
      name,
      age,
      status: "ACTIVE",
    };

    setUsers((prev) => [...prev, newUser]);
  };

  /* ---------- Side Effect ---------- */
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      addUser("Vishnu", 26);
      addUser("Alex");
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* ---------- Render ---------- */
  return (
    <div style={{ padding: 20 }}>
      <h1>React + TypeScript Basics</h1>

      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>

      <hr />

      <p>Status: {status}</p>
      <button onClick={toggleStatus}>Toggle Status</button>

      <hr />

      <p>Switch: {abc}</p>
      <button onClick={toggleAbc}>Switch Status</button>

      <hr />

      <h3>Users</h3>
      {loading && <p>Loading...</p>}

      {!loading &&
        users.map((user) => (
          <div key={user.id}>
            {user.name} — {user.status}
            {user.age && ` (${user.age})`}
          </div>
        ))}
    </div>
  );
};

export default Ts;
