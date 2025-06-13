import { UserAccount } from "@/types/UserAccount";

/* 4 users, each one with name, identity, email, phone, and role (admin, staff, professional or client) */
export const sampleUsers: UserAccount[] = [
  {
    id: 101,
    name: "Alice Johnson",
    identity: 987654321,
    email: "alice.johnson@gmail.com",
    phone: 987654321,
    role: "admin",
  },
  {
    id: 102,
    name: "Bob Smith",
    identity: 123456789,
    email: "bob.smith@gmail.com",
    phone: 123456789,
    role: "staff",
  },
  {
    id: 103,
    name: "Charlie Brown",
    identity: 123455432,
    email: "charlie.brown@gmail.com",
    phone: 123455432,
    role: "professional",
  },
  {
    id: 104,
    name: "Diana Prince",
    identity: 889877890,
    email: "diana.prince@gmail.com",
    phone: 889877890,
    role: "client",
  },
];
